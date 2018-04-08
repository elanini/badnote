const ADDRESS = 'http://localhost:3000';

function get_post_id() {
    let re = /class\/([^?]+)\?cid=(\d+)/;
    let res = re.exec(window.location);
    return (res[1] + res[2]);
}

function get_user_id() {
	let uid = window.localStorage.getItem('bad_note_uid');
	if (!uid) {
		uid = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
		window.localStorage.setItem('bad_note_uid', uid);
	}
	return uid;
}

$(document).ready(() => {
	const postid = get_post_id();
	console.log(postid);

	const uid = get_user_id();
	console.log(uid);

	const full_address = `${ADDRESS}/${postid}/${uid}`;
	console.log(full_address);

	let bad_note_button = $('<a class="post_action"  href="#">bad note</a>');
	bad_note_button.click((e) => {
		chrome.runtime.sendMessage({type: 'POST', address: full_address}, function(response) {
			bad_note_count_elem.text(response.count);
		});
	});

	let bad_note_count_elem = $('<span class="post_actions_number"></span>');

	chrome.runtime.sendMessage({type: 'GET', address: full_address}, function(response) {
		bad_note_count_elem.text(response.count);
	});

	$('#view_question_note_bar').append(
		// dot separator
		$('<span class="middot">·</span>'),
		bad_note_button,
		bad_note_count_elem,
	);

});
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


// window.addEventListener('load', function() {

//     let target = document.querySelector('div[data-pats="current_post"');
//     let config = {childList: true}
//     let cb = function(muts) {
//         add_buttons()window.addEventListener('load', function() {

//     let target = document.querySelector('div[data-pats="current_post"');
//     let config = {childList: true}
//     let cb = function(muts) {
//         add_buttons()
//     }
//     let observer = new MutationObserver(cb)
//     observer.observe(target, config)

//     add_buttons()

// }, false);
//     }
//     let observer = new MutationObserver(cb)
//     observer.observe(target, config)

//     add_buttons()

// }, false);
