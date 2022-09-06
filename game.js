// random draw 5 questions from these 12 attributes
const questions = [{"attribute": "elevation", "question": "The elevation of this lake is in the range (in meter)"},
                     {"attribute": "area", "question": "The surface area of this lake is"},
                     {"attribute": "link", "question": "This lake has its own wiki page."},
                     {"attribute": "ph", "question": "The measured pH value of this lake"},
                     {"attribute": "cond", "question": "The measured conductivity of this lake"},
                     {"attribute": "temp", "question": "The measured temperature of this lake"},
                     {"attribute": "o2", "question": "The measured dissolved oxygen level of this lake"},
                     {"attribute": "l", "question": "The max length of this lake is"},
                     {"attribute": "w", "question": "The max width of this lake is"},
                     {"attribute": "dep", "question": "The max depth of this lake is"},
                     {"attribute": "volumn", "question": "The water volume of this lake is"}];

const cantons = ["Valais", "Graubünden", "Ticino", "St. Gallen", "Glarus", "Bern", "Uri", "Obwalden", "Schwyz", "Vaud", "Nidwalden", "Appenzell Innerrhoden",
                 "Neuchâtel", "Fribourg", "Jura", "Zug", "Zürich", "Solothurn", "Appenzell Ausserrhoden", " Basel-Stadt", "Basel-Landschaft",
                 "Aargau", "Thurgau", "Genève", "Schaffhausen", "Luzern"]

const correct_res = ["Yes, you are correct about this!", "Congret, it's a right statement!", "Brilliant! You are right!", "Ohh you get it right!", "Yes! You are close to the final answer!", "Correct! Keep it up!"];
const wrong_res = ["No, you miss the right answer :(", "It's not right...", "No, it is not the case.", "Sadly it is a wrong statement.", "False :P"];

var question_ids = []; //storing the 5 randomly selected question ids.
var selected_lake_id = 0; //store the selected lake.
const total_num = 237; //possible lake id from 1 to 237, randomly draw from this range!
var current_q = 0; //store the number of questions that have been asked

var dialogue_div = document.getElementById("dialogue");

function startDialogue(){

    Promise.all([lake_promise]).then((results) => {
        let total_lake_data = results[0];

        // show message in the dialogue
        var bubble1 = document.createElement("div");
        bubble1.setAttribute("class", "botMsg");
        bubble1.innerText = "Hello there! Are you interested in playing a game?";
        bubble1.style.animationDelay = "0s";
        dialogue_div.appendChild(bubble1);
        dialogue_div.scrollTop = dialogue_div.scrollHeight;

        var bubble2 = document.createElement("div");
        bubble2.setAttribute("class", "botMsg");
        bubble2.innerText = "I have a lake in mind, you have random access to five of its attributes. Select one statement for each of the attribute and I will tell you if the statement is correct or not. You win the game if you can guess which lake it is in the end ;)";
        bubble2.style.animationDelay = "2s";
        dialogue_div.appendChild(bubble2);
        dialogue_div.scrollTop = dialogue_div.scrollHeight;

        var bubble3 = document.createElement("div");
        bubble3.setAttribute("class", "botMsg");
        bubble3.innerText = "Shall we start?";

        //create buttons for the msg
        var choice_yes = document.createElement("div");
        choice_yes.setAttribute("class", "choice");
        choice_yes.setAttribute("name", "choice_btn");
        choice_yes.innerText = "Yes!";
        choice_yes.value = "yes";
        choice_yes.onclick = function() {respond(this, total_lake_data)};
        bubble3.appendChild(choice_yes);

        var choice_no = document.createElement("div");
        choice_no.setAttribute("class", "choice");
        choice_no.setAttribute("name", "choice_btn");
        choice_no.innerText = "Nah.";
        choice_no.value = "no";
        choice_no.onclick = function() {respond(this, total_lake_data)};
        bubble3.appendChild(choice_no);

        bubble3.style.animationDelay = "8s";
        dialogue_div.appendChild(bubble3);
        dialogue_div.scrollTop = dialogue_div.scrollHeight;
    });
}

function disabledAllButtons() {
    var btns = document.getElementsByName("choice_btn");
    for( i = 0; i < btns.length; i++ ) {
        btns[i].style.pointerEvents = "none";
    }
}

function newGame(total_lake_data){
    var bubble = document.createElement("div");
    bubble.setAttribute("class", "botMsg");
    bubble.innerText = "Do you want to start a new game?";

    //create buttons for the msg
    var choice_yes = document.createElement("div");
    choice_yes.setAttribute("class", "choice");
    choice_yes.setAttribute("name", "choice_btn");
    choice_yes.innerText = "Yes!";
    choice_yes.value = "yes";
    choice_yes.onclick = function() {respond(this, total_lake_data)};
    bubble.appendChild(choice_yes);

    var choice_no = document.createElement("div");
    choice_no.setAttribute("class", "choice");
    choice_no.setAttribute("name", "choice_btn");
    choice_no.innerText = "Nah.";
    choice_no.value = "no";
    choice_no.onclick = function() {respond(this, total_lake_data)};
    bubble.appendChild(choice_no);

    bubble.style.animationDelay = "2s";
    dialogue_div.appendChild(bubble);
    dialogue_div.scrollTop = dialogue_div.scrollHeight;
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function respond(ele, total_lake_data, correct_answer = ""){
    //console.log(total_lake_data);
    ele.style.backgroundColor = "#90E0EF";
    disabledAllButtons();

    var userBubble = document.createElement("div");
    userBubble.setAttribute("class", "userMsg");
    userBubble.innerText = ele.innerText;
    userBubble.style.animationDelay = "0.2s";
    dialogue_div.appendChild(userBubble);
    dialogue_div.scrollTop = dialogue_div.scrollHeight;

    if(ele.value == "yes"){
        current_q = 0;
        question_ids = [];
        var res = document.createElement("div");
        res.setAttribute("class", "botMsg");
        res.innerText = "Okay! Here comes the first one.";
        res.style.animationDelay = "1s";
        dialogue_div.appendChild(res);
        dialogue_div.scrollTop = dialogue_div.scrollHeight;

        //select target lake
        selected_lake_id = Math.floor(Math.random() * total_num);
        console.log("Select lake with id ", selected_lake_id);

        // draw questions
        while(question_ids.length < 5){
            var r = Math.floor(Math.random() * 11);
            if(question_ids.indexOf(r) === -1) question_ids.push(r);
        }
        console.log(question_ids);

        renderQ(current_q, selected_lake_id, total_lake_data);
    }
    else if(ele.value == "no"){
        var res = document.createElement("div");
        res.setAttribute("class", "botMsg");
        res.innerText = "Okay... Reload me if you change your mind ;)";
        res.style.animationDelay = "1s";
        dialogue_div.appendChild(res);
        dialogue_div.scrollTop = dialogue_div.scrollHeight;
    }
    else if(ele.value == "correct"){
        if(current_q == 5){
            //final guess is correct!
            var res = document.createElement("div");
            res.setAttribute("class", "botMsg");
            res.innerText = "Bravo! Are you a mind reader?!";
            res.style.animationDelay = "1s";
            dialogue_div.appendChild(res);
            dialogue_div.scrollTop = dialogue_div.scrollHeight;

            ////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////can have some effect here/////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            });

            //ask if the user want to continue
            newGame(total_lake_data);
        }
        else{
            var res = document.createElement("div");
            res.setAttribute("class", "botMsg");
            res.innerText = correct_res[Math.floor(Math.random() * correct_res.length)];
            res.style.animationDelay = "1s";
            dialogue_div.appendChild(res);
            dialogue_div.scrollTop = dialogue_div.scrollHeight;

            //render next question if 5 questions are not reached
            current_q = current_q+1;
            renderQ(current_q, selected_lake_id, total_lake_data);
        }
    }
    else if(ele.value == "wrong"){
        if(current_q == 5){
            //final guess is wrong!
            var res = document.createElement("div");
            res.setAttribute("class", "botMsg");
            res.innerHTML = "No, it's not what I have in mind, better luck next time :) I was thinking about lake <span class='cr'>"+correct_answer+"</span>.";
            res.style.animationDelay = "1s";
            res.style.backgroundColor = "lightgray";
            dialogue_div.appendChild(res);
            dialogue_div.scrollTop = dialogue_div.scrollHeight;

            //ask if the user want to continue
            newGame(total_lake_data);
        }
        else{
            var res = document.createElement("div");
            res.setAttribute("class", "botMsg");
            res.innerHTML = wrong_res[Math.floor(Math.random() * wrong_res.length)]+" "+correct_answer;
            res.style.animationDelay = "1s";
            res.style.backgroundColor = "lightgray";
            dialogue_div.appendChild(res);
            dialogue_div.scrollTop = dialogue_div.scrollHeight;

            current_q = current_q+1;
            renderQ(current_q, selected_lake_id, total_lake_data);
        }
    }
}

function renderQ(noQ, selected_lake_id, total_lake_data){
    var question = document.createElement("div");
    question.setAttribute("class", "botMsg");
    var ops = [];
    
    if(noQ == 5){
        question.innerText = "Alright now, what is the lake in my mind?"
        //generate three options of the lake's names
        var random_ids = []; //store other two ids
        while(random_ids.length < 2){
            var r = Math.floor(Math.random() * total_num);
            if(random_ids.indexOf(r) === -1) random_ids.push(r);
        }
        //[["name", "correct"],["name", "wrong"],["name", "wrong"]]
        ops = [[total_lake_data[selected_lake_id].name, "correct"], [total_lake_data[random_ids[0]].name, "wrong"], [total_lake_data[random_ids[1]].name, "wrong"]]
        shuffle(ops);
        console.log(ops);

        renderOps(question, ops, total_lake_data, total_lake_data[selected_lake_id].name); 
    }
    else if(noQ == 0){
        question.innerText = "This lake in my mind is located in Canton";
        
        ops.push([total_lake_data[selected_lake_id].canton, "correct"]);
        while(ops.length < 3){
            var r = Math.floor(Math.random() * 26);
            if(cantons[r] != total_lake_data[selected_lake_id].canton && ops.indexOf([cantons[r], "wrong"]) === -1) ops.push([cantons[r], "wrong"]);
        }
        shuffle(ops);
        console.log(ops);
        renderOps(question, ops, total_lake_data, "This lake is located in <span class='cr'>"+total_lake_data[selected_lake_id].canton+"</span>."); 
    }
    else{
        question.innerText = questions[question_ids[noQ]].question;
        correct_ans = "";

        //generate options
        if(question_ids[noQ] == 0){//elevation
            var r11 = parseInt(total_lake_data[selected_lake_id].elevation/100)*100;// - 50,
                r12 = parseInt(total_lake_data[selected_lake_id].elevation/100)*100 + 100;
            console.log(r11, r12);
            ops.push([r11+" to "+r12,"correct"]);
            correct_ans = "The elevation of this lake is in the range <span class='cr'>"+r11+" meters to "+r12+"</span>.";
            var ran = [Math.floor(Math.random()*2), Math.floor(Math.random()*2)], r21, r22, r31, r32; //[0,0]: both smaller than correct answer, 1: larger
            for (let i = 0; i < ran.length; i++){
                if(ran[i] == 0){
                    var r1 = Math.floor(Math.random() * (r11 - 850 + 1)) + 800;
                    var r21 = parseInt(r1/100)*100;// - 50,
                        r22 = parseInt(r1/100)*100 + 100;

                    ops.push([r21+" to "+r22,"wrong"]);
                }
                else if(ran[i] == 1){
                    var r1 = Math.floor(Math.random() * (3000 - r12 + 1)) + r12 + 50;
                    var r21 = parseInt(r1/100)*100;// - 50,
                        r22 = parseInt(r1/100)*100 + 100;

                    ops.push([r21+" to "+r22,"wrong"]);
                }
            }
        }
        else if(question_ids[noQ] == 1){// area
            var a = total_lake_data[selected_lake_id].area;
            ops = [["unknown", "wrong"], ["< 100 hectares", "wrong"], [">= 100 hectares", "wrong"]];
            if(a == ""){
                ops[0][1] = "correct";
                correct_ans = "The surface area is <span class='cr'>unknown</span>.";
            }
            else{
                if(a >= 100){
                    ops[2][1] = "correct";
                    correct_ans = "The surface area is<span class='cr'> >= 100 hectares</span>.";
                }
                else{
                    ops[1][1] = "correct";
                    correct_ans = "The surface area is <span class='cr'>< 100 hectares</span>.";
                }
            }
        }
        else if(question_ids[noQ] == 2){// link
            var link = total_lake_data[selected_lake_id].link;
            ops = [["Yes, I can get more information there.", "wrong"], ["No, someone create a wikipage for it please.", "wrong"]];
            if(a == ""){
                ops[1][1] = "correct";
                correct_ans = "<span class='cr'>This lake does not have its own wikipage</span>.";
            }
            else{
                ops[0][1] = "correct";
                correct_ans = "<span class='cr'>This lake has its own wikipage</span>.";
            }
        }
        else if(question_ids[noQ] == 3){// ph
            var ph = total_lake_data[selected_lake_id].ph;
            ops = [["is unknown.", "wrong"], ["is dangerous for the fish.", "wrong"], ["creates pressure for some fish.", "wrong"], ["shows best condition.", "wrong"]];
            if(ph == ""){
                ops[0][1] = "correct";
                correct_ans = "The pH value <span class='cr'>is unknown</span>.";
            }
            else if(parseFloat(ph)<4 || parseFloat(ph)>11.5){
                ops[1][1] = "correct";
                correct_ans = "The pH value <span class='cr'>is dangerous for the fish</span>.";
            }
            else if(parseFloat(ph)>6.5 && parseFloat(ph)<8.5){
                ops[3][1] = "correct";
                correct_ans = "The pH value <span class='cr'>shows best condition</span>.";
            }
            else{
                ops[2][1] = "correct";
                correct_ans = "The pH value <span class='cr'>creates pressure for some fish</span>.";
            }
        }
        else if(question_ids[noQ] == 4){// cond
            var cond = total_lake_data[selected_lake_id].cond;
            ops = [["is unknown.", "wrong"], ["is in the low range.", "wrong"], ["is in the mid range.", "wrong"], ["is in the high range.", "wrong"]];
            if(cond == ""){
                ops[0][1] = "correct";
                correct_ans = "The conductivity <span class='cr'>is unknown</span>.";
            }
            else if(parseFloat(cond)<200){
                ops[1][1] = "correct";
                correct_ans = "The conductivity <span class='cr'>is in the low range</span>.";
            }
            else if(parseFloat(cond)<1000){
                ops[2][1] = "correct";
                correct_ans = "The conductivity <span class='cr'>is in the mid range</span>.";
            }
            else{
                ops[3][1] = "correct";
                correct_ans = "The conductivity <span class='cr'>is in the high range</span>.";
            }
        }
        else if(question_ids[noQ] == 5){// temp
            var temp = total_lake_data[selected_lake_id].temp;
            ops = [["is unknown.", "wrong"], ["is below 12°C.", "wrong"], ["is higher than 12°C.", "wrong"]];
            if(temp == ""){
                ops[0][1] = "correct";
                correct_ans = "The temperature <span class='cr'>is unknown</span>.";
            }
            else if(parseFloat(temp)<12){
                ops[1][1] = "correct";
                correct_ans = "The temperature <span class='cr'>is below 12°C</span>.";
            }
            else{
                ops[2][1] = "correct";
                correct_ans = "The temperature <span class='cr'>is higher than 12°C</span>.";
            }
        }
        else if(question_ids[noQ] == 6){// o2
            var o2 = total_lake_data[selected_lake_id].o2;
            ops = [["is unknown.", "wrong"], ["is dangerous for all fish.", "wrong"], ["allows very few fish to live.", "wrong"], ["creates pressure for some fish especialy the small ones.", "wrong"], ["is safe for all fish.", "wrong"]];
            if(o2 == ""){
                ops[0][1] = "correct";
                correct_ans = "The level of dissolved oxygen <span class='cr'>is unknown</span>.";
            }
            else if(parseFloat(o2)<4){
                ops[1][1] = "correct";
                correct_ans = "The level of dissolved oxygen <span class='cr'>is dangerous for all fish</span>.";
            }
            else if(parseFloat(o2)<6.5){
                ops[2][1] = "correct";
                correct_ans = "The level of dissolved oxygen <span class='cr'>allows very few fish to live</span>.";
            }
            else if(parseFloat(o2)<9.5){
                ops[3][1] = "correct";
                correct_ans = "The level of dissolved oxygen <span class='cr'>creates pressure for some fish especialy the small ones</span>.";
            }
            else{
                ops[4][1] = "correct";
                correct_ans = "The level of dissolved oxygen <span class='cr'>is safe for all fish</span>.";
            }
        }
        else{
            var va = total_lake_data[selected_lake_id][questions[question_ids[noQ]].attribute];
            ops = [["unknown.", "wrong"], ["known.", "wrong"]];
            if(va == ""){
                ops[0][1] = "correct";
                correct_ans = "Correct answer is <span class='cr'>unknown</span>.";
            }
            else{
                ops[1][1] = "correct";
                correct_ans = "Correct answer is <span class='cr'>known</span>.";
            }
        }

        shuffle(ops);
        console.log(ops);
        renderOps(question, ops, total_lake_data, correct_ans);        
    }

    question.style.animationDelay = "2s";
    dialogue_div.appendChild(question);
    dialogue_div.scrollTop = dialogue_div.scrollHeight;
}

function renderOps(question, op_list, total_lake_data, correct_answer){
    for (let i = 0; i < op_list.length; i++) {
        var choice = document.createElement("div");
        choice.setAttribute("class", "choice");
        choice.setAttribute("name", "choice_btn");
        choice.innerText = op_list[i][0];
        choice.value = op_list[i][1];
        choice.onclick = function() {respond(this, total_lake_data, correct_answer)};
        question.appendChild(choice);
    }
}

const gameContainer = document.querySelector('#game');
const game_btn = document.getElementById("game_btn");
const game_btn_img = document.getElementById("game_icon");
const game_group_div = document.getElementById("game_group");
const map_group_div = document.getElementById("map_group");
var game_started = false;
var game_opened = false; // if the game part is opened by the user

game_btn.addEventListener('click', () => {
    if(!game_opened){
        // open the game and flip the button image
        game_opened = true;
        game_btn_img.style.transform = 'scaleX(-1)';
        // set the style here so the size change
        game_group_div.style.left = 0;
        map_group_div.style.width = "68%";

        // if the game start for the first time, load instructions
        if(!game_started){
            game_started = true;
            startDialogue();
            console.log("start dialogue!");
        }
    }
    else{
        // close the game and flip the button image
        game_opened = false;
        game_btn_img.style.transform = 'scaleX(1)';
        game_group_div.style.left = '-31%';
        map_group_div.style.width = "99%";
    }
    map_width = map_div.node().getBoundingClientRect().width;
    map_height = map_div.node().getBoundingClientRect().height;
    console.log(map_width, map_height);
    drawMap();

}, false);