/********************************************************************
 noBorderOnMaximized - a KWin Script

Copyright (C) 2015 Tamás Gere <gt@kani.hu>

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*********************************************************************/
var borderless = new Array();
function d(obj) {
	for (i in obj) print('debug: ['+i+']: '+obj[i]);
}
function noBorderOnMaximized(client, h, v) {
	if (client.maximizable && h && v) {
		//print('Maximized: "'+client.caption+'"');
		if (client.noBorder == false) {
			//print('Removing border: "'+client.caption+'"');
			borderless[borderless.length] = client;
			client.noBorder = true;
		}
	} else {
		//print('No longer maximized: "'+client.caption+'"');
		var found = borderless.indexOf(client);
		if (found != -1 || client.noBorder == true) {
			//print('Restoring border: "'+client.caption+'"');
			client.noBorder = false;
			borderless.splice(found, 1);
		}
	}
}

workspace.clientMaximizeSet.connect(noBorderOnMaximized);

var lastAdded;
var checkMaximized = function() {
		var area = workspace.clientArea(KWin.MaximizeArea, workspace.activeScreen, workspace.currentDesktop);
		if (lastAdded.maximizable == true && lastAdded.normalWindow == true && lastAdded.width >= (area.width - 5) && lastAdded.height >= (area.height - 40)) {
			print('Initially maximized: '+lastAdded.caption);
			
			// re-check active client:
			var activeClient = workspace.activeClient;
			if (activeClient != lastAdded) workspace.activeClient = lastAdded;
			workspace.slotWindowMaximize();
			workspace.slotWindowMaximize();
			if (activeClient != lastAdded) workspace.activeClient = activeClient;
			
			//execute our func
			noBorderOnMaximized(lastAdded, true, true);
		} else {
			print('Initially NOT maximized: '+lastAdded.caption);
		}
};

var tim = new QTimer;
tim.singleShot = true;
tim.timeout.connect(checkMaximized);

workspace.clientAdded.connect(function(client) {
	lastAdded = client;
	checkMaximized();
	//tim.start(1); // wait until the client is actually mapped and activ(atabl)e
	//client['clientMaximizedStateChanged(KWin::Client*,bool,bool)'].connect(noBorderOnMaximized);
});

workspace.clientRemoved.connect(function(client) {
	noBorderOnMaximized(client, false, false);
});