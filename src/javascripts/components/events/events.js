import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';
import util from '../../helpers/util';
import eventsData from '../../helpers/data/eventsData';
import './events.scss';

const moment = require('moment');

$('.toast').toast();

// builds all the events!
const eventPageDomStringBuilder = (uid) => {
  eventsData.retrieveEventsByUserId(uid)
    .then((events) => {
      // sorts the events by time and date
      const eventsToSort = events;
      eventsToSort.sort((a, b) => {
        const aDate = a.dateTime;
        const bDate = b.dateTime;
        // eslint-disable-next-line no-nested-ternary
        return aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
      });
      let domstring = '';
      domstring += '<table id="events-table" class="mb-5">';
      domstring += '<thead id="events-header">';
      domstring += '<tr>';
      domstring += '<th colspan="4">Events</th>';
      domstring += '</tr>';
      domstring += '</thead>';
      domstring += '<tbody>';
      eventsToSort.forEach((event) => {
        // reformats the dates to look better on display
        const displayDate = moment(event.dateTime, 'YYYY[-]MM[-]DD[T]HH[:]mm').format('MMMM Do[,] YYYY');
        const displayTime = moment(event.dateTime, 'YYYY[-]MM[-]DD[T]HH[:]mm').format('h[:]mm a');
        if (moment(event.dateTime) > moment()) {
          domstring += '<tr class="event-row">';
          // checks to see if a link exists, if it does then it makes the title an 'a' tag
          if (event.link === '') {
            domstring += `<td id="event${event.id}-title">${event.title}</td>`;
          } else {
            domstring += `<td id="event${event.id}-title"><a target="_blank" href="${event.link}">${event.title}</a></td>`;
          }
          domstring += `<td id="event${event.id}-date">${displayDate}</td>`;
          domstring += `<td id="event${event.id}-time">${displayTime}</td>`;
          domstring += `<td><button type="button" id="edit_${event.id}" data-toggle="modal"`;
          domstring += `data-eventid="${event.id}" data-purpose="Edit" data-target="#eventModal" class="mr-3 btn btn-info event-edit-button">Edit</button>`;
          domstring += `<button type="button" id="delete_${event.id}" class="btn btn-danger event-delete-button">X</button></td>`;
          domstring += '</tr>';
        }
      });
      domstring += '</tbody>';
      domstring += '</table>';
      domstring += '<table id="past-events-table">';
      domstring += '<thead id="past-events-header">';
      domstring += '<tr>';
      domstring += '<th colspan="4">Past Events</th>';
      domstring += '</tr>';
      domstring += '</thead>';
      domstring += '<tbody id="past-events-tbody">';
      eventsToSort.forEach((event) => {
        // reformats the dates to look better on display
        const displayDate = moment(event.dateTime, 'YYYY[-]MM[-]DD[T]HH[:]mm').format('MMMM Do[,] YYYY');
        const displayTime = moment(event.dateTime, 'YYYY[-]MM[-]DD[T]HH[:]mm').format('h[:]mm a');
        if (moment(event.dateTime) < moment()) {
          domstring += '<tr class="event-row">';
          // checks to see if a link exists, if it does then it makes the title an 'a' tag
          if (event.link === '') {
            domstring += `<td id="event${event.id}-title">${event.title}</td>`;
          } else {
            domstring += `<td id="event${event.id}-title"><a target="_blank" href="${event.link}">${event.title}</a></td>`;
          }
          domstring += `<td id="event${event.id}-date">${displayDate}</td>`;
          domstring += `<td id="event${event.id}-time">${displayTime}</td>`;
          domstring += '<td><button type="button" class="mr-3 btn past-event-edit">Edit</button>';
          domstring += `<button type="button" id="delete_${event.id}" class="btn btn-danger event-delete-button">X</button></td>`;
          domstring += '</tr>';
        }
      });
      domstring += '</tbody>';
      domstring += '</table>';
      util.printToDom('events-list', domstring);
      if ($('#past-events-tbody')[0].innerHTML === '') {
        $('#past-events-table').addClass('hide');
      }
    }).catch(err => console.error('no events to show', err));
};

// builds the base page and button to add events and the modal it calls
const showEventPage = () => {
  $('.navbar-collapse').collapse('hide');
  const uId = firebase.auth().currentUser.uid;
  $('#events-page').removeClass('hide');
  eventPageDomStringBuilder(uId);
  const today = moment().format('YYYY[-]MM[-]DD');
  const thisTime = moment().format('HH[:]mm');
  let domstring = '<button id="add-event-button" class="btn btn-success" data-eventid="submit-new-event" data-toggle="modal" data-target="#eventModal" data-purpose="Add">Add Event</button>';
  domstring += '<div class="modal fade" id="eventModal" tabindex="-1" role="dialog" aria-labelledby="eventModalLabel" aria-hidden="true">';
  domstring += '<div class="modal-dialog" role="document">';
  domstring += '<div class="modal-content">';
  domstring += '<div class="modal-header">';
  domstring += '<h5 class="modal-title" id="eventModalLabel"></h5>';
  domstring += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
  domstring += '<span aria-hidden="true">&times;</span>';
  domstring += '</button>';
  domstring += '</div>';
  domstring += '<form id="">';
  domstring += '<div class="modal-body" id="">';
  domstring += '<div class="form-group">';
  domstring += '<label for="event-name">Event Name:</label>';
  domstring += '<input type="text" class="form-control" id="event-name" name="event-name" placeholder="Party Party Party" required></input>';
  domstring += '</div>';
  domstring += '<div id="events-date-input" class="form-row">';
  domstring += '<div class="form-group justify-content-center col-md-6">';
  domstring += '<label class="col-md-12" for="event-date">Event Date: </label>';
  domstring += `<input type="date" id="event-date" name="event-date" value="${today}" min="${today}" max="${moment(today).add(3, 'y').format('YYYY[-]MM[-]DD')}" required>`;
  domstring += '</div>';
  domstring += '<div class="form-group justify-content-center col-md-6">';
  domstring += '<label class="col-md-12" for="event-time">Time: </label>';
  domstring += `<input class="justify-self-center" type="time" id="event-time" name="event-time" value="${thisTime}" required></input>`;
  domstring += '</div>';
  domstring += '<label for="event-link">Event Link:</label>';
  domstring += '<input type="url" class="form-control" id="event-link" name="event-link" placeholder="www.partypartyparty.com"></input>';
  domstring += '<p>(Optional)</p>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '<div class="modal-footer">';
  domstring += '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
  domstring += '<button type="submit" id="" class="btn btn-primary change-button">Save changes</button>';
  domstring += '</div>';
  domstring += '</form>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '</div>';
  domstring += '<div id="events-list"></div>';
  util.printToDom('events-page', domstring);
};

// adds events from the eventModal
const addEventToDatabase = (e) => {
  e.preventDefault();
  e.stopPropagation();
  $('#eventModal').modal('hide');
  const uId = firebase.auth().currentUser.uid;
  const newDateTime = `${$('#event-date')[0].value}T${$('#event-time')[0].value}`;
  const newEvent = {
    title: $('#event-name')[0].value,
    dateTime: newDateTime,
    uid: uId,
    link: $('#event-link')[0].value,
  };
  eventsData.addEventToDatabase(newEvent)
    .then(() => {
      // builds the event table and resets the values in the modal
      eventPageDomStringBuilder(uId);
      $('#event-name')[0].value = '';
      $('#event-time')[0].value = moment().format('HH[:]mm');
      $('#event-date')[0].value = moment().format('YYYY[-]MM[-]DD');
      $('#event-link')[0].value = '';
    })
    .catch(err => console.error('wont add event', err));
};

// deletes the selected event from firebase
const deleteEventFromDatabase = (e) => {
  const userId = firebase.auth().currentUser.uid;
  const eventId = e.target.id.split(/_(.+)/)[1];
  eventsData.removeEventFromDatabaseByEventId(eventId)
    .then(() => {
      eventPageDomStringBuilder(userId);
    })
    .catch(err => console.error('problem deleting event', err));
};

// edits the event from the editEventModal
const editEventFromDatabase = (e) => {
  e.preventDefault();
  e.stopPropagation();
  $('#eventModal').modal('hide');
  const userId = firebase.auth().currentUser.uid;
  const eventId = e.currentTarget.firstElementChild.id;
  const newDateTime = `${$('#event-date')[0].value}T${$('#event-time')[0].value}`;
  const newEventObj = {
    title: $('#event-name')[0].value,
    dateTime: newDateTime,
    uid: userId,
    link: $('#event-link')[0].value,
  };
  eventsData.editEventOnDatabase(newEventObj, eventId)
    .then(() => {
      eventPageDomStringBuilder(userId);
    })
    .catch(err => console.error('problem editing event', err));
};

// there is only one modal, this uses data attributes to build the modal to either edit or add
const addOrEditModalDisplay = (e) => {
  const button = $(e.relatedTarget);
  const modalPurpose = button.data('purpose');
  let eventName = '';
  let eventTime = moment().format('HH[:]mm');
  let eventLink = '';
  let eventDate = moment().format('YYYY[-]MM[-]DD');
  const eventId = button.data('eventid');
  if (modalPurpose === 'Edit') {
    eventName = button.parent().prev().prev().prev()
      .text();
    eventLink = button.parent().prev().prev().prev()
      .children()
      .attr('href');
    eventTime = button.parent().prev().text();
    eventDate = button.parent().prev().prev().text();
    eventDate = moment(eventDate, 'MMMM Do[,] YYYY').format('YYYY[-]MM[-]DD');
    eventTime = moment(eventTime, 'h[:]mm a').format('HH[:]mm');
  }
  const modal = $('#eventModal');
  modal.find('.modal-title').text(`${modalPurpose} an Event`);
  modal.find('#event-name').val(eventName);
  modal.find('#event-link').val(eventLink);
  modal.find('#event-date').val(eventDate);
  modal.find('#event-time').val(eventTime);
  modal.find('.change-button').text(`Save ${modalPurpose}ed Event`);
  modal.find('.modal-body').attr('id', eventId);
  modal.find('.change-button').addClass(modalPurpose);
  modal.find('form').attr('id', modalPurpose);
};

// all the fun event page button handlers
const eventPageButtonHandlers = () => {
  $('body').on('click', '.events-nav-button', showEventPage);
  $('#events-page').on('show.bs.modal', '#eventModal', addOrEditModalDisplay);
  $('#events-page').on('submit', '#Add', addEventToDatabase);
  $('#events-page').on('click', '.event-delete-button', deleteEventFromDatabase);
  $('#events-page').on('submit', '#Edit', editEventFromDatabase);
};

export default { eventPageButtonHandlers };
