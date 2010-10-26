/* Blank Canvas Gmail Signatures [http://blankcanvas.me/gmailsignatures/]
 * Copyright (c) 2009, 2010 Jerome Dane <http://blankcanvas.me/contact/>  
 * 
 * This file is part of the Blank Canvas Gmail Signatures. Please see /readme.md for
 * more information, credits, and author requests. 
 * 
 * BC Gmail Signatures is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

if(!com) { var com = {} }
if(!com.BlankCanvas) { com.BlankCanvas = {} }

window.addEventListener("load", function() {
	com.BlankCanvas.GmailSigsLoader = function() {
		com.BlankCanvas.GmailSignatures.init();
		com.BlankCanvas.GmailAPI.registerGmailHandler(function(gmailInstance) {
			var sigInstance = new com.BlankCanvas.GmailSigInstance(gmailInstance);
		});
	}
	com.BlankCanvas.GmailSigsLoader();
}, false);