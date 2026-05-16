import "./bootstrap";
import "./echo";

const userId = document.head.querySelector('meta[name="user-id"]').content;

window.Echo.channel(`chat.${userId}`).listen(".message.sent", (e) => {
    console.log(e);
});
