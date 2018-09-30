const net = require('net');
const fs = require('fs');
const port = 8123;
let qa;
let current_question = 0;

const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, ()=> {
    fs.readFile('qa.json', 'utf8', (err, data)=> {
        if(err){
            console.log(e);
        }else{
            qa = shuffle(JSON.parse(data));
            send_request('QA');
        }
    });
});

client.on('data', (data)=>{
    console.log('Server: ' + data);
    if(data === 'DEC') {
        client.destroy();
    }else{
        generate_quiz(data);
    }
});

function generate_quiz(data){
    if(data == 'ACK'){
        generate_question();
    }else{
        check_answer(data);
        generate_question();
    }
}

function generate_question(){
    if(qa.length> current_question){
        send_request('q:' + qa[current_question].question);
    }else{
        client.destroy();
    }
}

function check_answer(num_answer){
    console.log('///////QUESTION: '+qa[current_question].question);
    console.log('///////RIGHT ANSWER: '+qa[current_question].answer);
    if(num_answer == current_question){
        console.log('Server`s answer is right');
    }else{
        console.log('///////SERVER`S ANSWER: '+qa[num_answer].answer);
        console.log('///////Server`s answer is wrong');
    }
    current_question++;
}

function send_request(message){
    client.write(message);
    console.log('You: ' + message);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.ceil(Math.random() * (i+1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}