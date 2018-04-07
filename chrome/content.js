function getPostId() {
    let re = /class\/([^?]+)\?cid=(\d+)/;
    let res = re.exec(window.location);
    return (res[1] + res[2])
}

function teacher_div() {
    return document.querySelector('div#instructor_answer div[class="post_region_actions view_mode"]')
}

function student_div() {
    return document.querySelector('div#member_answer div[class="post_region_actions view_mode"]')
}

function question_div() {
    return document.getElementById('view_question_note_bar')
}

function newbutton() {
    var el = document.createElement("button")
    var content = document.createTextNode("bad");
    el.appendChild(content)
    return el
}

function handleClick(ev) {
    console.log(ev)
}

function add_buttons() {
    console.log("add buttons")
    let rows = [
        teacher_div(),
        student_div(),
        question_div()
    ];
    for (row of rows) {
        if (row == null || row == 0) {
            continue;
        }
        let button = newbutton()
        button.addEventListener("click", handleClick)
        row.appendChild(button)
    }
    // let t = teacher_div()
    // let s = student_div()
    // let q = question_div()
    
}


window.addEventListener('load', function() {

    let target = document.querySelector('div[data-pats="current_post"');
    let config = {childList: true}
    let cb = function(muts) {
        add_buttons()
    }
    let observer = new MutationObserver(cb)
    observer.observe(target, config)

    add_buttons()

}, false);
