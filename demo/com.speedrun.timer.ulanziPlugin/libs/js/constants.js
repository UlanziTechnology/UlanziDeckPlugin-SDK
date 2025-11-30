

/**
 * Events used for communicating with Ulanzi Stream Deck
 */
const Events = Object.freeze({
	CONNECTED: 'connected',
	CLOSE: 'close',
	ERROR: 'error',
	ADD: 'add',
	RUN: 'run',
	PARAMFROMAPP: 'paramfromapp',
	PARAMFROMPLUGIN: 'paramfromplugin',
	SETACTIVE: 'setactive',
	CLEAR: 'clear',
	TOAST:'toast',
	STATE:'state',
	OPENURL:'openurl',
	OPENVIEW:'openview',
	SELECTDIALOG:'selectdialog'
});

/**
 * Errors received from WebSocket
 */
const SocketErrors = {
	DEFAULT:'closed *****'
};


