const SERVER_ADDRESS = 'http://localhost:3000';

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

function teacher_div() {
    return $('#instructor_answer div.post_region_actions.view_mode');
}

function student_div() {
    return $('#member_answer div.post_region_actions.view_mode');
}

function question_div() {
    return $('#view_question_note_bar');
}

function add_button_to_elem(elem, address, button_text, button_text_undo) {
    let button_elem = $(`<a class="post_action"  href="#"></a>`);
    let count_elem = $('<span class="post_actions_number"></span>');

    button_elem.click((e) => {
        if (button_elem.text() == button_text) {
            chrome.runtime.sendMessage({type: 'POST', address: address}, function(response) {
                count_elem.text(response.count);
            });
            button_elem.text(button_text_undo);
        }
        else {
            chrome.runtime.sendMessage({type: 'DELETE', address: address}, function(response) {
                count_elem.text(response.count);
            });
            button_elem.text(button_text);
        }
    });

    chrome.runtime.sendMessage({type: 'GET', address: address}, function(response) {
        count_elem.text(response.count);

        button_elem.text(response.voted ? button_text_undo : button_text);

        elem.append(
            // dot separator
            $('<span class="middot">·</span>'),
            button_elem,
            count_elem,
        );
    });
}

function add_all_buttons() {
    console.log("add buttons");

    const postid = get_post_id();
    console.log(postid);

    const uid = get_user_id();
    console.log(uid);

    const address = `${SERVER_ADDRESS}/${postid}/${uid}`;
    console.log(address);

    add_button_to_elem(
        teacher_div(),
        // add post type to address
        address + '/2',
        'no thanks',
        'undo no thanks'
    );

    add_button_to_elem(
        student_div(),
        address + '/1',
        'no thanks',
        'undo no thanks'
    );

    add_button_to_elem(
        question_div(),
        address + '/0',
        'bad question',
        'undo bad question'
    );
}

$(document).ready(() => {
    add_all_buttons();

    let target = document.querySelector('div[data-pats="current_post"');
    let config = {childList: true};
    let observer = new MutationObserver(add_all_buttons);
    observer.observe(target, config);
});
