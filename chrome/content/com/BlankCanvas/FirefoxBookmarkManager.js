/* Blank Canvas Signatures for Gmail [http://blankcanvas.me/gmailsignatures/]
 * Copyright (c) 2009, 2010 Jerome Dane <http://blankcanvas.me/contact/>  
 * 
 * This file is part of the Blank Canvas Signatures for Gmail. Please see /readme.md for
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

com.BlankCanvas.FirefoxBookmarkManager = {
	service:Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService),
	create:function(url, title, folder) {
		try {
			var bmsvc = com.BlankCanvas.FirefoxBookmarkManager.service;
			var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
			var uri = ios.newURI(url, null, null);
			var newFolderId = typeof(folder) == 'undefined' ? bmsvc.bookmarksMenuFolder : folder;
			var newBkmkId = bmsvc.insertBookmark(newFolderId, uri, bmsvc.DEFAULT_INDEX, title);
			return newBkmkId;
		} catch(e) {
			alert(e);
			//com.BlankCanvas.GmailSignatures.debug(e, 'com.BlankCanvas.FirefoxBookmarkManager.create()');
		}		
	},
	getByUrl:function(url) {
		try {
			var bmsvc = com.BlankCanvas.FirefoxBookmarkManager.service;
			var ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
			var uri = ios.newURI(url, null, null);
			var bookmarksArray = bmsvc.getBookmarkIdsForURI(uri, {});
			return bookmarksArray;
		} catch(e) {
			alert(e);
		}
	},
	getKeyword:function(bookmarkId) {
		var bmsvc = com.BlankCanvas.FirefoxBookmarkManager.service;
		return bmsvc.getKeywordForBookmark(bookmarkId);
	},
	getTitle:function(bookmarkId) {
		var bmsvc = com.BlankCanvas.FirefoxBookmarkManager.service;
		return bmsvc.getItemTitle(bookmarkId);
	},
	setKeyword:function(bookmarkId, keyword) {
		var bmsvc = com.BlankCanvas.FirefoxBookmarkManager.service;
		bmsvc.setKeywordForBookmark(bookmarkId, keyword);
	},
	setTitle:function(bookmarkId, keyword) {
		var bmsvc = com.BlankCanvas.FirefoxBookmarkManager.service;
		bmsvc.setItemTitle(bookmarkId, keyword);
	}
	
}