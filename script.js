class Symbol {
    constructor(value, type, precedence) { //0 = num, 1 = +, 2 = -, 3 = *, 4 = /, 5 = ^
        this.value = value;
        this.type = type;
        this.precedence = precedence;
        this.left = null;
        this.right = null;
    }
}

var head = null;
var stack = [];
var expression = "";
var evaluate = [];
var traverse;
var parentheses = 0;

function drawTree() {
    let canvas = document.getElementById("tree");
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, 600, 600);
    ctx.strokeRect(0, 0, 600, 600);
    ctx.fillStyle = "rgb(0, 0, 0)";
    if (head == null) {
        return;
    }
    let bfs = [head];
    let parents = [null];
    let depth = 0;
    while (bfs.length > 0) {
        let layer = bfs.length;
        for (let i = 0; i < layer; i++) {
            let x = (i * 600 / layer) + 300 / layer;
            if (bfs[0].left != null) {
                parents.push(x);
                bfs.push(bfs[0].left);
            }
            if (bfs[0].right != null) {
                parents.push(x);
                bfs.push(bfs[0].right);
            }
            ctx.beginPath();
            ctx.arc(x, depth * 100 + 50, 15, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.font = "20px serif";
            if (bfs[0].type == 0) {
                ctx.fillText(bfs[0].value, x - 5 - (bfs[0].value == 0 ? 0 : Math.floor(Math.log10(bfs[0].value))) * 5, depth * 100 + 57);
            }
            else {
                ctx.fillText(bfs[0].value, x - 5, depth * 100 + 57);
            }
            if (parents[0] != null) {
                ctx.beginPath();
                ctx.moveTo(x + (parents[0] - x) * 15 / Math.hypot(parents[0] - x, 70), depth * 100 + 50 - 1500 / Math.hypot(parents[0] - x, 100));
                ctx.lineTo(parents[0] - (parents[0] - x) * 15 / Math.hypot(parents[0] - x, 70), depth * 100 - 50 + 1500 / Math.hypot(parents[0] - x, 100));
                ctx.stroke();
            }
            bfs.shift();
            parents.shift();
        }
        depth++;
    }

}

function input(value, type) {
    document.getElementById("eval").innerHTML = "";
    evaluate = [];
    document.getElementById("math").innerHTML = "";
    document.getElementById("msg").innerHTML = "";
    document.getElementById("next").hidden = true;
    if (type == 1) {
        plus();
    }
    else if (type == 2) {
        minus();
    }
    else if (type == 3) {
        times();
    }
    else if (type == 4) {
        divide();
    }
    else if (type == 5) {
        power();
    }
    else if (type == 6) {
        popen();
    }
    else if (type == 7) {
        pclose();
    }
    else {
        number(value);
    }
    console.log(head);
}

function number(num) {
    expression += num;
    document.getElementById("expression").innerHTML = expression;
    if (head == null) {
        head = new Symbol(num, 0, 0);
        stack = [head];
    }
    else {
        if (stack[0].type == 0) {
            stack[0].value *= 10;
            stack[0].value += num;
        }
        else {
            stack[0].right = new Symbol(num, 0, 0);
            stack.unshift(stack[0].right);
        }
    }
    drawTree();
}

function plus() {
    if (head == null || stack[0].type != 0) {
        document.getElementById("msg").innerHTML = "Can only use plus symbol directly after a number.";
        return;
    }
    expression += "+";
    document.getElementById("expression").innerHTML = expression;
    let prev = stack.shift();
    while (stack.length > 0 && stack[0].precedence >= 1 + parentheses * 10) {
        prev = stack.shift();
    }
    if (stack.length == 0) {
        head = new Symbol("+", 1, 1 + parentheses * 10);
        head.left = prev;
        stack.unshift(head);
    }
    else {
        let node = new Symbol("+", 1, 1 + parentheses * 10);
        node.left = prev;
        if (prev == stack[0].left) {
            stack[0].left = node;
        }
        else {
            stack[0].right = node;
        }
        stack.unshift(node);
    }
    drawTree();
}

function minus() {
    if (head == null || stack[0].type != 0) {
        document.getElementById("msg").innerHTML = "Can only use minus symbol directly after a number.";
        return;
    }
    expression += "-";
    document.getElementById("expression").innerHTML = expression;
    let prev = stack.shift();
    while (stack.length > 0 && stack[0].precedence >= 1 + parentheses * 10) {
        prev = stack.shift();
    }
    if (stack.length == 0) {
        head = new Symbol("-", 2, 1 + parentheses * 10);
        head.left = prev;
        stack.unshift(head);
    }
    else {
        let node = new Symbol("-", 2, 1 + parentheses * 10);
        node.left = prev;
        if (prev == stack[0].left) {
            stack[0].left = node;
        }
        else {
            stack[0].right = node;
        }
        stack.unshift(node);
    }
    drawTree();
}

function times() {
    if (head == null || stack[0].type != 0) {
        document.getElementById("msg").innerHTML = "Can only use times symbol directly after a number.";
        return;
    }
    expression += "*";
    document.getElementById("expression").innerHTML = expression;
    let prev = stack.shift();
    while (stack.length > 0 && stack[0].precedence >= 2 + parentheses * 10) {
        prev = stack.shift();
    }
    if (stack.length == 0) {
        head = new Symbol("*", 3, 2 + parentheses * 10);
        head.left = prev;
        stack.unshift(head);
    }
    else {
        let node = new Symbol("*", 3, 2 + parentheses * 10);
        node.left = prev;
        if (prev == stack[0].left) {
            stack[0].left = node;
        }
        else {
            stack[0].right = node;
        }
        stack.unshift(node);
    }
    drawTree();
}

function divide() {
    if (head == null || stack[0].type != 0) {
        document.getElementById("msg").innerHTML = "Can only use divide symbol directly after a number.";
        return;
    }
    expression += "/";
    document.getElementById("expression").innerHTML = expression;
    let prev = stack.shift();
    while (stack.length > 0 && stack[0].precedence >= 2 + parentheses * 10) {
        prev = stack.shift();
    }
    if (stack.length == 0) {
        head = new Symbol("/", 4, 2 + parentheses * 10);
        head.left = prev;
        stack.unshift(head);
    }
    else {
        let node = new Symbol("/", 4, 2 + parentheses * 10);
        node.left = prev;
        if (prev == stack[0].left) {
            stack[0].left = node;
        }
        else {
            stack[0].right = node;
        }
        stack.unshift(node);
    }
    drawTree();
}

function power() {
    if (head == null || stack[0].type != 0) {
        document.getElementById("msg").innerHTML = "Can only use power symbol directly after a number.";
        return;
    }
    expression += "^";
    document.getElementById("expression").innerHTML = expression;
    let prev = stack.shift();
    while (stack.length > 0 && stack[0].precedence >= 3 + parentheses * 10) {
        prev = stack.shift();
    }
    if (stack.length == 0) {
        head = new Symbol("^", 5, 3 + parentheses * 10);
        head.left = prev;
        stack.unshift(head);
    }
    else {
        let node = new Symbol("^", 5, 3 + parentheses * 10);
        node.left = prev;
        if (prev == stack[0].left) {
            stack[0].left = node;
        }
        else {
            stack[0].right = node;
        }
        stack.unshift(node);
    }
    drawTree();
}

function popen() {
    if (head != null && stack[0].type == 0) {
        document.getElementById("msg").innerHTML = "Cannot use open parentheses directly after a number.";
        return;
    }
    document.getElementById("msg").innerHTML = "";
    expression += "(";
    document.getElementById("expression").innerHTML = expression;
    parentheses++;
}

function pclose() {
    if (parentheses < 1) {
        document.getElementById("msg").innerHTML = "No open parentheses to close.";
        return;
    }
    if (stack[0].type != 0) {
        document.getElementById("msg").innerHTML = "Cannot use close parentheses directly after a function.";
        return;
    }
    parentheses--;
    document.getElementById("msg").innerHTML = "";
    expression += ")";
    document.getElementById("expression").innerHTML = expression;
}

function reset() {
    head = null;
    stack = [];
    expression = "";
    parentheses = 0;
    document.getElementById("expression").innerHTML = "Use the buttons below to create an expression";
    document.getElementById("msg").innerHTML = "";
    document.getElementById("eval").innerHTML = "";
    evaluate = [];
    document.getElementById("math").innerHTML = "";
    drawTree();
}

function preorder(head) {
    if (head == null) {
        return;
    }
    evaluate.push(head);
    preorder(head.left);
    preorder(head.right);
}

function postorder(head) {
    if (head == null) {
        return;
    }
    postorder(head.left);
    postorder(head.right);
    evaluate.push(head);
}

function eval(type) {
    document.getElementById("math").innerHTML = "";
    if (stack.length < 1 || stack[0].type != 0) {
        document.getElementById("msg").innerHTML = "Invalid expression";
        return;
    }
    traverse = type;
    evaluate = [];
    if (type == 0) {
        document.getElementById("msg").innerHTML = "Evaluating expression tree using preorder traversal... ";
        preorder(head);
    }
    else {
        document.getElementById("msg").innerHTML = "Evaluating expression tree using postorder traversal... ";
        postorder(head);
    }
    traverse = type;
    let display = [];
    for (let i = 0; i < evaluate.length; i++) {
        display.push(evaluate[i].value);
    }
    
    document.getElementById("eval").innerHTML = display;
    document.getElementById("next").hidden = false;
}

function math(a, b, f) {
    if (f == 1) {
        return a + b;
    }
    if (f == 2) {
        return a - b;
    }
    if (f == 3) {
        return a * b;
    }
    if (f == 4) {
        return a / b;
    }
    if (f == 5) {
        return Math.pow(a, b);
    }
}

function next() {
    if (evaluate.length == 1) {
        document.getElementById("msg").innerHTML = "Evaluation complete.";
        document.getElementById("next").hidden = true;
    }
    for (let i = 2; i < evaluate.length; i++) {
        if (traverse == 0) {
            if (evaluate[i - 2].type != 0 && evaluate[i - 1].type == 0 && evaluate[i].type == 0) {
                let result = math(evaluate[i - 1].value, evaluate[i].value, evaluate[i - 2].type);
                document.getElementById("math").innerHTML = evaluate[i - 1].value + evaluate[i - 2].value + evaluate[i].value + "=" + result;
                evaluate[i] = new Symbol(result, 0, 0);
                evaluate.splice(i - 2, 2);
                break;
            }
        }
        else {
            if (evaluate[i - 2].type == 0 && evaluate[i - 1].type == 0 && evaluate[i].type != 0) {
                let result = math(evaluate[i - 2].value, evaluate[i - 1].value, evaluate[i].type);
                document.getElementById("math").innerHTML = evaluate[i - 2].value + evaluate[i].value + evaluate[i - 1].value + "=" + result;
                evaluate[i] = new Symbol(result, 0, 0);
                evaluate.splice(i - 2, 2);
                break;
            }
        }
    }
    let display = [];
    for (let i = 0; i < evaluate.length; i++) {
        display.push(evaluate[i].value);
    }
    document.getElementById("eval").innerHTML = display;
    drawTree();
}