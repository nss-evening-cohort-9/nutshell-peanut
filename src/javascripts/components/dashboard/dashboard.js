import './dashboard.scss';
import $ from 'jquery';
import util from '../../helpers/util';

const dashBoardPage = $('#dashboard-page');
const messagesPage = $('#messages-page');
const newsPage = $('#news-page');
const eventsPage = $('#events-page');
const diaryPage = $('#diary-page');

const eventListeners = () => {
  $('.dashboard-link').click((e) => {
    if (e.target.closest('.card').id === 'eventsCard') {
      dashBoardPage.addClass('hide');
      eventsPage.removeClass('hide');
    } else if (e.target.closest('.card').id === 'messagesCard') {
      dashBoardPage.addClass('hide');
      messagesPage.removeClass('hide');
    } else if (e.target.closest('.card').id === 'diaryCard') {
      dashBoardPage.addClass('hide');
      diaryPage.removeClass('hide');
    } else if (e.target.closest('.card').id === 'newsCard') {
      dashBoardPage.addClass('hide');
      newsPage.removeClass('hide');
    }
  });
};

const drawDashboard = () => {
  let domString = '';
  domString += '<div class="container mt-4">';
  domString += '<div class="row">';
  domString += '  <div class="d-flex justify-content-around flex-wrap col-12 col-sm-10 offset-sm-1" id="dashboard-cards">';
  domString += '    <div class="card" id="eventsCard">';
  domString += '      <a class="dashboard-link events-nav-button" href="#">';
  domString += '        <div class="dashboard-img-contain">';
  // domString += '          <img class="img-fluid dashboard-img" src="../assets/images/dashboard/events.png" alt="">';
  domString += '          <img class="img-fluid dashboard-img" src="https://anexactinglife.files.wordpress.com/2018/12/Charlie-Brown-Christmas-Dance.jpg?w=450" alt="">';
  domString += '        </div>';
  domString += '        <div class="card-body text-center">';
  domString += '          <h5 class="card-title">Events</h5>';
  domString += '        </div>';
  domString += '      </a>';
  domString += '    </div>';
  domString += '    <div class="card" id="messagesCard">';
  domString += '      <a class="dashboard-link messages-nav-button" href="#">';
  domString += '        <div class="dashboard-img-contain">';
  // domString += '          <img class="img-fluid dashboard-img" src="../assets/images/dashboard/messages.jpg" alt="">';
  domString += '          <img class="img-fluid dashboard-img" src="https://i.pinimg.com/originals/1b/61/13/1b6113c2bf409ce6beb84fa7ba1e0ece.png" alt="">';
  domString += '        </div>';
  domString += '        <div class="card-body text-center">';
  domString += '          <h5 class="card-title">Messages</h5>';
  domString += '        </div>';
  domString += '      </a>';
  domString += '    </div>';
  domString += '    <div class="card" id="diaryCard">';
  domString += '      <a class="dashboard-link diary-nav-button" href="#">';
  domString += '        <div class="dashboard-img-contain">';
  // domString += '          <img class="img-fluid dashboard-img" src="../assets/images/dashboard/diary.png" alt="">';
  domString += '          <img class="img-fluid dashboard-img" src="http://jaycwolfe.com/wp-content/uploads/2014/11/Snoopy_Typewriter.png" alt="">';
  domString += '        </div>';
  domString += '        <div class="card-body text-center">';
  domString += '          <h5 class="card-title">Diary</h5>';
  domString += '        </div>';
  domString += '      </a>';
  domString += '    </div>';
  domString += '    <div class="card" id="newsCard">';
  domString += '      <a class="dashboard-link news-nav-button" href="#">';
  domString += '        <div class="dashboard-img-contain">';
  // domString += '          <img class="img-fluid dashboard-img" src="../assets/images/dashboard/news.jpg" alt="">';
  domString += '          <img class="img-fluid dashboard-img" src="https://i.pinimg.com/236x/90/e1/e4/90e1e4632e2340dba3cdcd0469e59fd6--snoopy-peanuts-charlie-brown.jpg" alt="">';
  domString += '        </div>';
  domString += '        <div class="card-body text-center">';
  domString += '          <h5 class="card-title">News</h5>';
  domString += '        </div>';
  domString += '      </a>';
  domString += '    </div>';
  domString += '  </div>';
  domString += '</div>';
  domString += '</div>';
  util.printToDom('dashboard-page', domString);
  eventListeners();
};

export default { drawDashboard };
