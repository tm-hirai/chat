'use strict';
import $ from 'jquery';
const global = Function('return this;')();
global.jQuery = $;
import io from 'socket.io-client';
// import bootstrap from 'bootstrap';

$('#post-message-button').on('click', () => {
  const button = $('#post-message-button')
  const userId = button.data('user-id');
  const channelId = button.data('channel-id');
  const content = $('#message-content').val();

  console.log(userId);
  console.log(channelId);
  console.log(content);

  // const candidateId = button.data('candidate-id');
  // const availability = parseInt(button.data('availability'));
  // const nextAvailability = (availability + 1) % 3;
  $.post(`/channels/${channelId}/message`,
    { userId: userId, content: content },
    (data) => {
      console.log(data);
      // button.data('availability', data.availability);
      // const availabilityLabels = ['欠', '？', '出'];
      // button.text(availabilityLabels[data.availability]);

      // const buttonStyles = ['btn-danger', 'btn-secondary', 'btn-success'];
      // button.removeClass('btn-danger btn-secondary btn-success');
      // button.addClass(buttonStyles[data.availability]);
    });
});

// チャットページで使用
function websocket() {
  let reg = /channels\/.+-/;
  if (location.href.match(reg)) {
    const channelId = $('#post-message-button').data('channel-id');
    const socket = io('//' + document.location.hostname + ':' + document.location.port);
    socket.on(`${channelId}`, (data) => {
      console.log('websocket:' + data);
      console.log(data);
    });
  }
}
websocket();

