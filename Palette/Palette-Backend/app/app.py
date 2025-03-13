from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from openai import OpenAI
import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials
from test import file
from pypdf import PdfReader
import anthropic
import json
import socket
import base64
import os
# Move Firebase initialization to the global scope, outside of any route
cred = credentials.Certificate(r"./mock/serviceAccountKey.json")
try:
    firebase_admin.initialize_app(cred)
except ValueError:
    # App already initialized
    pass

db = firestore.client()


app = Flask(__name__)
CORS(app)
@app.route('/')
def index():
    return "Hello World " + socket.gethostname()


@app.route('/api/stream', methods= ['GET','POST'])
def stream():
    message = request.json['prompt']
    id = request.json['id']
    context = request.json['context']

    file_data = request.json['files']
    model = request.json['model']
    company = request.json['company']

    
    

    db = firestore.client()
    doc_ref = db.collection("users").document(id)

    doc = doc_ref.get()
        # Access the settings field from the document
    if doc.exists:
        doc_data = doc.to_dict()
        settings =doc_data.get('settings')  # or doc_data['settings'] if you're sure it exists
    else:
        print("Document does not exist")
    

    if company == 'OpenAI':
        return stream_openai(message,  context, file_data, model, settings)
    elif company == 'Anthropic':
        return stream_anthropic(message,  context, file_data, model, settings)


def stream_anthropic(message,  context, file_data, model, settings):
    client = anthropic.Anthropic(
                # defaults to os.environ.get("ANTHROPIC_API_KEY")
                api_key=settings['Anthropic'],
            )

    def generate():
        with client.messages.stream(
            max_tokens=1024,
            messages=[{"role": "user", "content": "user prompt:" + message + "Context (only use the context for this chat history):" + str(context)}],
            model=model,
        ) as stream:
            for text in stream.text_stream:
                print(text, end="", flush=True)
                yield text

    return Response(generate(), mimetype='text/plain')
        
    

def stream_openai(message,  context, file_data, model, settings):
    # Capture the message from the request before entering generator
   
    openai_client = OpenAI(api_key=settings['OpenAI'])
    
    def generate():
        stream = openai_client.chat.completions.create(
            model=model,  # Fixed model name from "gpt-4o"
            messages=[{"role": "user", "content": "user prompt:" + message + "Context (only use the context for this chat history):" + str(context)}],  # Use captured message
            stream=True,
        )

        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                print(content, end='', flush=True)  # Print each chunk as it arrives
                yield content
    
    print("Starting stream response:")
    return generate(), {"Content-Type": "text/plain"}







@app.route('/api/chat', methods=['GET','POST'])
def chat():
    try:
        data = request.get_json()
        
   
        id = data['id']
        context = data['context']

        file_data = data['files']
        if file_data:
            print("entered")
            file_data = handle_file_load(file_data)
            print("file_data:", file_data['all_text'])
            context.append({"files": file_data['all_text']})
            for file in file_data['all_paths']:
                os.remove(file)

        

        # Limit the context to 2000 characters
        #context = limit_context(context)
        print("context:", context)
        print("Exited limit context")
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
        #context = data['context']
        print("context:", context)



          
        if company == 'OpenAI':
            
            completion = openai_client.chat.completions.create(
            model=model,
            messages=[
               
                {
                "role": "user",
                
                "content": "user prompt:" + prompt + "Context (only use the context for this chat history):" + str(context)
                
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
    
    
        
        
    

                
      
        

class FileProcessor:
    ALLOWED_EXTENSIONS = {
        'application/pdf': '.pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'text/plain': '.txt'
    }

    @staticmethod
    def get_mime_type(base64_data):
        # Extract MIME type from data URI
        try:
            mime_type = base64_data.split(';')[0].split(':')[1]
            return mime_type
        except IndexError:
            return None

    @staticmethod
    def get_file_extension(mime_type):
        return FileProcessor.ALLOWED_EXTENSIONS.get(mime_type)

    @staticmethod
    def process_file(base64_data, file_extension):
        try:
            # Remove data URI prefix and decode
            if ',' in base64_data:
                file_data = base64.b64decode(base64_data.split(',')[1])
            else:
                file_data = base64.b64decode(base64_data)

            # Generate unique filename
            import uuid
            filename = f"{str(uuid.uuid4())}{file_extension}"
            
            # Save file
            with open(filename, 'wb') as f:
                f.write(file_data)
            
            return filename
        except Exception as e:
            raise Exception(f"Error processing file: {str(e)}")


def handle_file_load(raw_file_data):
    allowed_file_data = raw_file_data
   
    

    all_text = []
    all_paths = []
    for file in allowed_file_data:
        if file:
          
            file_specs = upload_file(file)
         
            if file_specs['file_type'] == 'application/pdf':
                text = extract_pdf_text(file_specs['file_path'])
                all_text.append(text['text'])
            all_paths.append(file_specs['file_path'])
    print("all_paths:", all_paths)
    return {"message": "Files uploaded successfully", "all_text": all_text, "all_paths": all_paths}



def upload_file(file):
    try:
        # Get the base64 data from request
        print("entered2")
        data = file
        print(data)
        if not data:
            return 

        # Get MIME type and file extension
        mime_type = FileProcessor.get_mime_type(data)
        if not mime_type:
            return 

        file_extension = FileProcessor.get_file_extension(mime_type)
        if not file_extension:
            return 

        # Process and save the file
        filename = FileProcessor.process_file(data, file_extension)

        # Here you can add specific processing based on file type
        result = {
            'message': 'File successfully processed',
            'file_path': filename,
            'file_type': mime_type
        }

        # Add file-specific processing
        if file_extension == '.pdf':
            # Process PDF (example: use PyPDF2 or pdfplumber)
            result['processor'] = 'PDF processor'
        elif file_extension == '.docx':
            # Process DOCX (example: use python-docx)
            result['processor'] = 'DOCX processor'
        elif file_extension in ['.jpg', '.png', '.gif']:
            # Process images (example: use Pillow)
            result['processor'] = 'Image processor'
        elif file_extension == '.txt':
            # Process text files
            result['processor'] = 'Text processor'
        
        return result

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    



def extract_pdf_text(path):
    print("ENTERED EXTRACT PDF TEXT")
    file_path = "./" + path
    print("file_path:", file_path)
    reader = PdfReader(file_path)
    text = ''
    for page in reader.pages:
        text += page.extract_text()
    return {"text": text}



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
        prompt_len = 0
        response_len = 0
        files_len = 0
        if 'prompt' in item:
            prompt_len = len(str(item['prompt']))
        if 'response' in item:
            response_len = len(str(item['response']))
        if 'files' in item:
            files_len = len(str(item['files']))
            print("files_len:", files_len)

        item_length = prompt_len + response_len + files_len
        if total_chars + item_length <= max_chars:
            limited_context.append(item)
            total_chars += item_length
        else:
            fill_chars = max_chars - total_chars
            
            



    
    return limited_context

if __name__ == '__main__':
    app.run(debug=True, port=5001)

