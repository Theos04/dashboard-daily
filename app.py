from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import eventlet
import datetime
eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Store connected devices
connected_devices = {}
device_data = {}

# Store application data
crm_data = {
    'contacts': [],
    'last_updated_by': None,
    'last_updated': None
}

sales_data = {
    'transactions': [],
    'last_updated_by': None,
    'last_updated': None
}

purchase_data = {
    'orders': [],
    'last_updated_by': None, 
    'last_updated': None
}

# === WEB SOCKET EVENTS ===
@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")
    emit('connection_established', {'message': 'Connected to server', 'sid': request.sid})

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")
    # Remove from connected devices
    for device_id, device_info in list(connected_devices.items()):
        if device_info['sid'] == request.sid:
            del connected_devices[device_id]
            emit('device_status_update', {'devices': connected_devices}, broadcast=True)
            break

@socketio.on('register_device')
def handle_device_registration(data):
    device_id = data.get('device_id')
    device_type = data.get('device_type', 'unknown')
    device_name = data.get('device_name', f'{device_type}_{device_id}')
    
    connected_devices[device_id] = {
        'sid': request.sid,
        'type': device_type,
        'name': device_name,
        'status': 'online',
        'last_seen': datetime.datetime.now().isoformat()
    }
    
    print(f"Device registered: {device_name} ({device_type}) - {request.sid}")
    emit('registration_success', {'device_id': device_id, 'device_type': device_type})
    emit('device_status_update', {'devices': connected_devices}, broadcast=True)

# === CRM DATA MANAGEMENT ===
@socketio.on('crm_update')
def handle_crm_update(data):
    """Update CRM data and sync across devices"""
    device_id = data.get('device_id')
    contacts = data.get('contacts', [])
    action = data.get('action', 'update')  # add, update, delete
    
    if action == 'add':
        crm_data['contacts'].extend(contacts)
    elif action == 'update':
        # Update existing contacts
        for updated_contact in contacts:
            for i, contact in enumerate(crm_data['contacts']):
                if contact.get('id') == updated_contact.get('id'):
                    crm_data['contacts'][i] = updated_contact
                    break
    elif action == 'delete':
        crm_data['contacts'] = [c for c in crm_data['contacts'] if c.get('id') not in [contact.get('id') for contact in contacts]]
    else:
        crm_data['contacts'] = contacts
    
    crm_data['last_updated_by'] = device_id
    crm_data['last_updated'] = datetime.datetime.now().isoformat()
    
    print(f"CRM data updated by {device_id}: {len(contacts)} contacts")
    
    # Sync with all other devices
    emit('crm_synced', {
        'contacts': crm_data['contacts'],
        'updated_by': device_id,
        'timestamp': crm_data['last_updated'],
        'action': action
    }, broadcast=True, include_self=False)

@socketio.on('get_crm_data')
def handle_get_crm():
    """Send current CRM data to requesting device"""
    emit('crm_data_response', crm_data)

# === SALES DATA MANAGEMENT ===
@socketio.on('sales_update')
def handle_sales_update(data):
    device_id = data.get('device_id')
    transactions = data.get('transactions', [])
    action = data.get('action', 'update')
    
    if action == 'add':
        sales_data['transactions'].extend(transactions)
    else:
        sales_data['transactions'] = transactions
    
    sales_data['last_updated_by'] = device_id
    sales_data['last_updated'] = datetime.datetime.now().isoformat()
    
    emit('sales_synced', {
        'transactions': sales_data['transactions'],
        'updated_by': device_id,
        'timestamp': sales_data['last_updated'],
        'action': action
    }, broadcast=True, include_self=False)

@socketio.on('get_sales_data')
def handle_get_sales():
    emit('sales_data_response', sales_data)

# === PURCHASE DATA MANAGEMENT ===
@socketio.on('purchase_update')
def handle_purchase_update(data):
    device_id = data.get('device_id')
    orders = data.get('orders', [])
    action = data.get('action', 'update')
    
    if action == 'add':
        purchase_data['orders'].extend(orders)
    else:
        purchase_data['orders'] = orders
    
    purchase_data['last_updated_by'] = device_id
    purchase_data['last_updated'] = datetime.datetime.now().isoformat()
    
    emit('purchase_synced', {
        'orders': purchase_data['orders'],
        'updated_by': device_id,
        'timestamp': purchase_data['last_updated'],
        'action': action
    }, broadcast=True, include_self=False)

@socketio.on('get_purchase_data')
def handle_get_purchase():
    emit('purchase_data_response', purchase_data)

# === REAL-TIME SYNC ===
@socketio.on('sync_data')
def handle_sync_data(data):
    """Generic data sync between devices"""
    device_id = data.get('device_id')
    sync_data = data.get('data')
    data_type = data.get('data_type')
    target_device = data.get('target_device', 'all')
    
    print(f"Data sync from {device_id}: {data_type}")
    
    if target_device == 'all':
        emit('data_synced', {
            'from_device': device_id,
            'data': sync_data,
            'data_type': data_type,
            'timestamp': datetime.datetime.now().isoformat()
        }, broadcast=True, include_self=False)
    else:
        # Send to specific device
        target_sid = None
        for dev_id, dev_info in connected_devices.items():
            if dev_id == target_device:
                target_sid = dev_info['sid']
                break
        
        if target_sid:
            emit('data_synced', {
                'from_device': device_id,
                'data': sync_data,
                'data_type': data_type,
                'timestamp': datetime.datetime.now().isoformat()
            }, room=target_sid)

# === API ENDPOINTS ===
@app.route('/')
def dashboard():
    return jsonify({'message': 'Flask-SocketIO Server is running'})

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'connected_devices': len(connected_devices),
        'devices': connected_devices
    })

@app.route('/api/crm/contacts')
def get_crm_contacts():
    return jsonify(crm_data)

@app.route('/api/sales/transactions')
def get_sales_transactions():
    return jsonify(sales_data)

@app.route('/api/purchase/orders')
def get_purchase_orders():
    return jsonify(purchase_data)

# === ENTRY POINT ===
if __name__ == '__main__':
    print("Starting Flask-SocketIO server...")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)