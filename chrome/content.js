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
    return $('#question #view_question_note_bar');
}

function note_div() {
    return $('#note #view_question_note_bar');
}

function add_button_to_elem(elem, address, button_text, button_text_undo, post_type, initial_states) {
    // if element doesn't exist, do nothing
    if (!elem.length) return;

    // if button has already been added, do nothing
    if ($(`#badnote-${post_type}`).length) return;

    let button_elem = $(`<a class="post_action" id="badnote-${post_type}"  href="#"></a>`);
    let count_elem = $('<span class="post_actions_number"></span>');

    button_elem.click((e) => {
        if (button_elem.text() == button_text) {
            chrome.runtime.sendMessage({type: 'POST', address: `${address}/${post_type}`}, function(response) {
                count_elem.text(response.count);
                button_elem.text(button_text_undo);
            });
        }
        else {
            chrome.runtime.sendMessage({type: 'DELETE', address: `${address}/${post_type}`}, function(response) {
                count_elem.text(response.count);
                button_elem.text(button_text);
            });
        }
    });

    const index = initial_states.map(e => parseInt(e.posttype)).indexOf(post_type);
    const state = index != -1 ? initial_states[index] : {count: 0, voted: false};

    count_elem.text(state.count);
    button_elem.text(state.voted ? button_text_undo : button_text);

    // add a dot separator unless the post is a note
    if (post_type != 3) {
        elem.append(
            $('<span class="middot">·</span>'),
        );
    }

    elem.append(
        button_elem,
        count_elem
    );
}

function add_all_buttons() {
    const postid = get_post_id();
    const uid = get_user_id();
    const address = `${SERVER_ADDRESS}/${postid}/${uid}`;

    chrome.runtime.sendMessage({type: 'GET', address: address}, function(response) {
        add_button_to_elem(
            teacher_div(),
            address,
            'no thanks',
            'undo no thanks',
            0,
            response
        );

        add_button_to_elem(
            student_div(),
            address,
            'no thanks',
            'undo no thanks',
            1,
            response
        );

        add_button_to_elem(
            question_div(),
            address,
            'bad question',
            'undo bad question',
            2,
            response
        );

        add_button_to_elem(
            note_div(),
            address,
            'bad note',
            'undo bad note',
            3,
            response
        );
    });

}

$(document).ready(() => {
    window.setTimeout(add_all_buttons);
    
    let target = document.querySelector('div[data-pats="current_post"]');
    let config = {childList: true};
    let observer = new MutationObserver(add_all_buttons);
    observer.observe(target, config);
});
