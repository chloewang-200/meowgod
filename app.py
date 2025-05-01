from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import auth, initialize_app, credentials, firestore
from google.cloud import firestore
from functools import wraps
from dotenv import load_dotenv

# Initialize Flask app
app = Flask(__name__)

# Configure CORS with specific settings
CORS(app, 
     resources={r"/*": {
         "origins": ["http://localhost:3000"],
         "methods": ["GET", "POST", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True
     }})

# Initialize Firebase Admin
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.Client()

# 🔐 Middleware: verify Firebase ID token
def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        print(f"Auth header: {auth_header}")  # Debug log
        
        if not auth_header.startswith("Bearer "):
            print("No Bearer token found")  # Debug log
            return jsonify({"error": "Unauthorized"}), 401
            
        id_token = auth_header.split(" ")[1]
        print(f"ID token: {id_token[:20]}...")  # Debug log (only first 20 chars for security)
        
        try:
            decoded_token = auth.verify_id_token(id_token)
            print(f"Decoded token UID: {decoded_token.get('uid')}")  # Debug log
            request.uid = decoded_token["uid"]
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Token verification error: {str(e)}")  # More detailed error logging
            return jsonify({"error": "Invalid or expired token"}), 401
    return decorated

# 🔄 Helper to get Firestore document reference
def get_user_ref(uid):
    return db.collection("users").document(uid)

# 📘 Get balance
@app.route("/balance", methods=["GET", "OPTIONS"])
@require_auth
def get_balance():
    if request.method == "OPTIONS":
        return "", 200
    uid = request.uid
    doc = get_user_ref(uid).get()
    if not doc.exists:
        return jsonify({"balance": 0.0})
    return jsonify({"balance": doc.to_dict().get("balance", 0.0)})

# ➕ Add to balance
@app.route("/balance/add", methods=["POST", "OPTIONS"])
@require_auth
def add_balance():
    if request.method == "OPTIONS":
        return "", 200
    uid = request.uid
    amount = float(request.json.get("amount", 0.0))
    user_ref = get_user_ref(uid)
    user_ref.set({"balance": firestore.Increment(amount)}, merge=True)
    return jsonify({"message": f"Added {amount} to balance"})

# ➖ Deduct from balance
@app.route("/balance/deduct", methods=["POST", "OPTIONS"])
@require_auth
def deduct_balance():
    if request.method == "OPTIONS":
        return "", 200
    uid = request.uid
    amount = float(request.json.get("amount", 0.0))
    user_ref = get_user_ref(uid)
    doc = user_ref.get()
    current_balance = doc.to_dict().get("balance", 0.0)
    if current_balance < amount:
        return jsonify({"error": "Insufficient balance"}), 400
    user_ref.set({"balance": current_balance - amount}, merge=True)
    return jsonify({"message": f"Deducted {amount} from balance"})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0') 