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
	let bad_note_button = $('<a class="post_action" onclick="on_bad_note_click()" href="#">bad note</a>');
	bad_note_button.click((e) => {
		console.log('test');
	});

	let bad_note_count_elem = $('<span class="post_actions_number"></span>');

	$('#view_question_note_bar').append(
		// dot separator
		$('<span class="middot">·</span>'),
		bad_note_button,
		bad_note_count_elem,
	);

	const postid = get_post_id();
	console.log(postid);

	const uid = get_user_id();
	console.log(uid);

	const full_address = `${ADDRESS}/${postid}/${uid}`;
	console.log(full_address);

	chrome.runtime.sendMessage({type: 'GET', address: full_address}, function(response) {
		bad_note_count_elem.text(response.cnt);
	});

	function on_bad_note_click() {
		chrome.runtime.sendMessage({type: 'POST', address: full_address}, function(response) {
			bad_note_count_elem.text(response.cnt);
		});
	};
});
