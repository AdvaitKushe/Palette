from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials
import anthropic
import json
import socket


# Move Firebase initialization to the global scope, outside of any route
cred = credentials.Certificate(r"./mock/serviceAccountKey.json")
try:
    firebase_admin.initialize_app(cred)
except ValueError:
    # App already initialized
    pass

app = Flask(__name__)
CORS(app)
@app.route('/')
def index():
    return "Hello World " + socket.gethostname()

@app.route('/api/chat', methods=['GET','POST'])
def chat():
    try:
        data = request.get_json()
   
        id = data['id']
        context = data['context']
        
        # Limit the context to 2000 characters
        context = limit_context(context)

        db = firestore.client()
        doc_ref = db.collection("users").document(id)

        doc = doc_ref.get()
        # Access the settings field from the document
        if doc.exists:
            doc_data = doc.to_dict()
            settings =doc_data.get('settings')  # or doc_data['settings'] if you're sure it exists
        else:
            print("Document does not exist")

        openai_client = OpenAI(api_key=settings['OpenAI'])

     
        company = data['company']
        model = data['model']
        prompt = data['prompt']
        context = data['context']


          
        if company == 'OpenAI':
            
            completion = openai_client.chat.completions.create(
            model=model,
            messages=[
               
                {
                "role": "user",
                "content": "user prompt:" + prompt + "Context (only use the context for this chat history if needed say this is the most you remember):" + str(context)
                
                }

                ]
            )
           
            return jsonify({"response": completion.choices[0].message.content, "company": "openai"}), 200

        elif company == 'Anthropic':
           

            

            # Define your API endpoint
            client = anthropic.Anthropic(
                # defaults to os.environ.get("ANTHROPIC_API_KEY")
                api_key=settings['Anthropic'],
            )
            print(client)
            message = client.messages.create(
                model=model,
                max_tokens=1024,
                messages=[
                    {"role": "user", "content": "user prompt:" + prompt + "Context (only use the context for this chat history if needed say this is the most you remember):" + str(context)}
                ]
            )

            # Make the POST request
            

            # Check the response
            
                # Success, process the JSON response
            
            result = message.content[0].text
           
            return jsonify({"response": result, "company": "anthropic"}), 200
          


                
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500   
        

"""@app.route('/api/settings', methods=['GET','POST'])
def settings():
    config_path = './mock/config.json'
    
    # Create directories if they don't exist
    os.makedirs(os.path.dirname(config_path), exist_ok=True)
    
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        
        # Create file if it doesn't exist
        with open(config_path, 'w') as f:
            f.write(json.dumps(data))
        
        return jsonify({"message": "Settings received"}), 200
    else:
        # Create empty config if file doesn't exist
        if not os.path.exists(config_path):
            with open(config_path, 'w') as f:
                f.write('{}')
                
        return jsonify({"message": "Settings received"}), 200
"""

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/test', methods=['GET','POST'])
def test():
    with open('./mock/config.json', 'r') as f:
        config = json.load(f)
    openai_client = OpenAI(api_key=config['OpenAI'])
    prompt = """
Write a bash script that takes a matrix represented as a string with 
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
"""

    response = openai_client.chat.completions.create(
    model="o1-preview",
    messages=[
        {
            "role": "user", 
            "content": prompt
        }
    ]
    )

    print(response.choices[0].message.content)
    return jsonify({"response": response.choices[0].message.content, "company": "openai"}), 200
 

def limit_context(context_array, max_chars=2000):
    total_chars = 0
    limited_context = []
    
    for item in context_array:
        item_length = len(str(item['prompt'])) + len(str(item['response']))
        if total_chars + item_length <= max_chars or not limited_context:
            limited_context.append(item)
            total_chars += item_length
        else:
            break
    
    return limited_context

if __name__ == '__main__':
    app.run(debug=True, port=5001)

