import './index.scss';
import { botsArray } from '../data/bot';
import ChatBot from './chatbot';

const chatbot = new ChatBot(botsArray);

chatbot.renderBotNavbar();

document.getElementById('research').onclick = () => {
  const message = document.getElementById('search').value;
  document.getElementById('search').value = '';
  chatbot.sendMessage(message, chatbot.bots[0]);
  chatbot.searchCommand(message);
};

document.getElementById('search').onkeyup = (e) => {
  if (e.key === 'Enter') {
    const message = document.getElementById('search').value;
    document.getElementById('search').value = '';
    chatbot.sendMessage(message, chatbot.bots[0]);
    chatbot.searchCommand(message);
  }
};
