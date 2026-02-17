from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import re
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Create tables
with app.app_context():
    db.create_all()

def validate_phone(phone):
    """Validate phone number format"""
    # Check if phone number matches pattern (+countrycode) followed by digits
    pattern = r'^\+?[0-9]{10,15}$'
    return re.match(pattern, phone.replace('-', '').replace(' ', ''))

def validate_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "رمز عبور باید حداقل ۶ کاراکتر باشد."
    return True, ""

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'phone', 'password']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return jsonify({'error': f'فیلد {field} الزامی است.'}), 400
        
        first_name = data['first_name'].strip()
        last_name = data['last_name'].strip()
        phone = data['phone'].strip()
        password = data['password']
        
        # Validate phone number
        if not validate_phone(phone):
            return jsonify({'error': 'شماره تلفن معتبر نیست.'}), 400
            
        # Validate password
        is_valid, msg = validate_password(password)
        if not is_valid:
            return jsonify({'error': msg}), 400
        
        # Check if phone number already exists
        existing_user = User.query.filter_by(phone=phone).first()
        if existing_user:
            return jsonify({'error': 'کاربری با این شماره تلفن قبلاً ثبت نام کرده است.'}), 409
        
        # Create new user
        user = User(
            first_name=first_name,
            last_name=last_name,
            phone=phone
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'ثبت نام با موفقیت انجام شد.',
            'user_id': user.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'خطای داخلی سرور.'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'phone' not in data or 'password' not in data:
            return jsonify({'error': 'شماره تلفن و رمز عبور الزامی هستند.'}), 400
        
        phone = data['phone'].strip()
        password = data['password']
        
        # Validate phone number
        if not validate_phone(phone):
            return jsonify({'error': 'شماره تلفن معتبر نیست.'}), 400
        
        # Find user by phone number
        user = User.query.filter_by(phone=phone).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'شماره تلفن یا رمز عبور نادرست است.'}), 401
        
        return jsonify({
            'message': 'ورود با موفقیت انجام شد.',
            'user_id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'خطای داخلی سرور.'}), 500

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        
        if 'phone' not in data:
            return jsonify({'error': 'شماره تلفن الزامی است.'}), 400
        
        phone = data['phone'].strip()
        
        # Validate phone number
        if not validate_phone(phone):
            return jsonify({'error': 'شماره تلفن معتبر نیست.'}), 400
        
        # Find user by phone number
        user = User.query.filter_by(phone=phone).first()
        
        if not user:
            # Return success even if user doesn't exist to prevent phone number enumeration
            return jsonify({'message': 'اگر حساب کاربری با این شماره وجود داشته باشد، لینک بازیابی رمز عبور ارسال خواهد شد.'}), 200
        
        # In a real application, we would send a reset link via SMS here
        # For this example, we'll just return a success message
        return jsonify({'message': 'لینک بازیابی رمز عبور به شماره تلفن شما ارسال شد.'}), 200
        
    except Exception as e:
        return jsonify({'error': 'خطای داخلی سرور.'}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        result = []
        for user in users:
            result.append({
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone': user.phone,
                'created_at': user.created_at.isoformat()
            })
        
        return jsonify({'users': result}), 200
        
    except Exception as e:
        return jsonify({'error': 'خطای داخلی سرور.'}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'API سرویس تأیید هویت کاربران'}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)