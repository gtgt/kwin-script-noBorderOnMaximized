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
function noBorderOnMaximized(client, h, v) {
	if (h && v) {
		// maximized
		print('Maximized: "'+client.caption+'"');
		if (client.noBorder == false) {
			print('Removing border: "'+client.caption+'"');
			borderless[borderless.length] = client;
			client.noBorder = true;
		}
	} else {
		// no longer maximized
		print('No longer maximized: "'+client.caption+'"');
		var found = borderless.indexOf(client);
		if (found != -1) {
			print('Restoring border: "'+client.caption+'"');
			client.noBorder = false;
			borderless.splice(found, 1);
		}
	}
}
 
workspace.clientMaximizeSet.connect(noBorderOnMaximized);