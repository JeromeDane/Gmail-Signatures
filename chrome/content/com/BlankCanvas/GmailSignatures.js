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

com.BlankCanvas.GmailSignatures = {
	debug:function(txt, source) {
		source = typeof(source) == 'undefined' ? '' : source;
		var message = "Error in Blank Canvas Gmail Signatures:\n\n" + (source != '' ? source + "\n\n" : '') + txt;
		if(com.BlankCanvas.GmailSignatures.getPref('debugMode') == 'alert')
			alert(message);
		else 
			throw new Error(message);
	},
	config:{
		signatureDataBookmarkUri:'http://blankcanvasweb.com/pages/id_9/n_gmail_signatures/data/'
	},
	init:function(callback) {
		try {
			var bcgs = com.BlankCanvas.GmailSignatures;
			function checkDefaultText() {
				try {
					if (bcgs.getPref('label1') == null) bcgs.setCharPref("label1", escape(bcgs.getText('default'))); // signature type label 1
					if (bcgs.getPref('label2') == null) bcgs.setCharPref("label2", escape(bcgs.getText('business'))); // signature type label 2
					if (bcgs.getPref('label3') == null) bcgs.setCharPref("label3", escape(bcgs.getText('family'))); // signature type label 3
					if (bcgs.getPref('label4') == null) bcgs.setCharPref("label4", escape(bcgs.getText('friends'))); // signature type label 4
					if (bcgs.getPref('sigPosition') == null) bcgs.setCharPref("sigPosition", "above"); // signature position
					if(typeof(callback) == 'function') callback();
				} catch(e) { com.BlankCanvas.GmailSignatures.debug(e, 'com.BlankCanvas.GmailSignatures.init() > checkDefaultText()'); }
			}
			switch(com.BlankCanvas.BrowserDetect.browser) {
				case 'Firefox':
					bcgs.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					bcgs.localeTextEn = document.getElementById("string-bundle-bcGmailSigs-en");
					checkDefaultText();
					break;
				case 'Chrome':
					var bcgs = com.BlankCanvas.GmailSignatures;
					chrome.extension.sendRequest({"name":"loadLocaleText"}, function(result) {
						bcgs.localeText = result;
						checkDefaultText();
					})					
					break;
			}
		} catch(e) { com.BlankCanvas.GmailSignatures.debug(e, 'com.BlankCanvas.GmailSignatures.init()'); }
	},
	getDataBookmarkId:function() {
		try {
			var bcgs = com.BlankCanvas.GmailSignatures;
			switch(com.BlankCanvas.BrowserDetect.browser) {
				case 'Firefox':
					bcgs.bookmarks = com.BlankCanvas.FirefoxBookmarkManager;
					var bookmarkArray = bcgs.bookmarks.getByUrl(bcgs.config.signatureDataBookmarkUri);
					return bookmarkArray.length > 0 ? bookmarkArray[0] : 
						bcgs.bookmarks.create(bcgs.config.signatureDataBookmarkUri, 'BC Gmail Signatures Data');
				default:
					return null;
			}
		} catch(e) { com.BlankCanvas.GmailSignatures.debug(e, 'com.BlankCanvas.GmailSignatures.getDataBookmarkId()'); }
	},
	getSigDataFromString:function(str) {
		try {
			var obj = JSON.parse(unescape(str.replace(/^[^:]+:\s/, '')));
			if(typeof(obj) == 'object')
				return obj;
		} catch(e) {
			return {};
		}
	},
	getDataBookmarkObject:function() {
		try {
			var bcgs = com.BlankCanvas.GmailSignatures;
			bcgs.bookmarks = com.BlankCanvas.FirefoxBookmarkManager;
			var bookmarkId = bcgs.getDataBookmarkId();
			switch(com.BlankCanvas.BrowserDetect.browser) {
				case 'Firefox':
					var str = bcgs.bookmarks.getTitle(bookmarkId);
					if(typeof(str) == 'null' || !str) return {};
					return bcgs.getSigDataFromString(str);
				default:
					return {};
			}
		} catch(e) { com.BlankCanvas.GmailSignatures.debug(e, 'com.BlankCanvas.GmailSignatures.getDataBookmarkObject()'); }
	},
	formatIconButton:function(button) {
		button.setAttribute('style', 'vertical-align:middle; margin-left:.5em; margin-top:-2px; cursor:pointer;');
		return button;
	},
	icons:{
		signatureCreate:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ1SURBVBgZBcFNiJVVGADg5z3fmTujY5NZBANBIVkZ2J9IKkZFGKRuglq1KaqVtoqoVbSKFi1LoY2QEVSbcqiFWWJqPxL044wUGESQVqJOKerce7/z9jyRmba++tXTy2YmnyphPaYQIJBBNuPWfls8l1/EfxdeOrJnxxAgMtO2148d2ffC+rWlxMqkkwBkQjp7aeT97xf99cfS5ZPzv6w6umfHElQoXdw+qN3KhX90JYIgG30243G6Muo9tOYa999WfdfOLs92x4UHd3163eG3ti8ViIgVmdkNumKiUIOu0AURFIFmdmZgx4ZZt9w6uazOTO+FAklAQQlKhBKhRCgRShfOnL/i5hUjd64Kz2+6XjfRPQkVIJPaEUJGaH1SQu0YZHHqXBq2sdaGHlg9KWoZQ4VMEjWKlBJRQiAb2RUGlBZa66RCFFAh0RBBCIlENiY6QBTRhyypIROo0MZk0hDITFAKWqhdkkGSQt/oG1ChtZSZJCkBSCCEE79+Yv7UnIuXLxiNR8rwnsomFfpGn2SjAUjQkuPzHzp98XMPb9ngplVrHFr42OX5ubpx1943K7Rxaple+2EopBZkBo2MNL3wnie2P6ovvbtntzp48iMb1232+6n9OyuMx72+Z3Zmwn03Fi3pkz5oyWffnjERKzy29lnw4iPvmDuxG/unKoyXWhu3lsNefPNnr0VKAVpy/tK/Fk5/7afTR72yda83DjxjqpuEqxVGV/u/pwfdDS+vG05nZpE0wLXLqn2Lzzn287s237XF3IndBlEd/fEwvB2ZacPOgzvHo3w8Iu5NuRxAkkhpovug1u5Q5SoGfWurDxzf/eW2/wEnITFm/fHryQAAAABJRU5ErkJggg%3D%3D',
		signatureEdit:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAK5SURBVBgZBcFPaJZ1HADwz+95n3e6uTnREGdljRKtGCYiHTLxkIUmQeeCOnXzVnQIoi5BQV08TMo6GIiHiKI6ZEWgszzEmtpqSDP7s9ycm9NN977vnuf37fNJEWH/G6df6l676vki2YXVSCAhEpFVOU8uzMX36daNV88MH+oApIhw8O2zZz45vOuhokjrgoYAIALC7NKKEz8vmP67fee3XyfWjwwfakMJRSNt6yob68avaRQpkYhMHVlVheWV2r6tffYPjNi4eLyncWCodf7jI1Jr6sUSUkq9EdHoajQkIZALZOpEIWlPf27r4jndQy/oH9xp4c9tJk4de7eEIEGBlAgJREqKRP/yKXVcsH7r4+Ynf9eVOvrWbtK7YUt/CRBB2SBJIiW5Doqkd3nEllWj+gef1r56UldP8tfYhJt3UhTtuR0FRBAoU6FISYFGkaxePG1LfKv/gYNa/30oNW9o9vbpzvOOXj+wsvvwZ5cKCGSkRJGSIiWtK19af/uU/gef1ZoaVjRXdG7db+bMed173zJVD2QoIFdEkBG4fflrPYs/2vjIMzrTxzS6QvvWfWZGRs3tGZY2bFdnoICcQ0QQTI+e1L3wk5W82dWLR2Qtt+fvNnNuwuLeo1LvgNXNpK4CFFBn6iAysxc/8vCel636Z8SlL84a+2be+Hdjlh57R9WzWaDZKFSdCpSQq5AjvPlLx9DkrM74VwZ3POHm7JzJsUk/7PvU9Sv3yipwYlPTSjuDEqqqVtcMrG0a/+Oa9z8Ytnv7oOXNOyw9edyjffeIIIIL1yqRw0qrAiVU7ZyrnKNTS+te/9flFCYlkJdIS5UcRJEUOSnLlKs6V1DCSqueWdPVuOu1oc6aiCgEGdDfXYIIuptJSnKzkRbrKk9BCSnFe0+9cvq5lNLOED0AgkAIIEAr5zxaFk7A/5IUWNTkV3l/AAAAAElFTkSuQmCC',
		signatureOptions:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALTSURBVBgZBcFNaNdlHADwz/P8fpvbfJnO+M+XtKz1ovSqSEaJIUWRXoQKIoI81MU6dAgPQXQphS4dIiOQhMp7h4hAD84iArVSK8FU0NRtbro52+b2/z3fPp8UEZ77YPCN7kXzXsvJBnQhgYRIRNEu5dz4WBxON2+8d3Tf9lmAFBFe/Pjno1+/s2FtzmlxUAkAIiBcuzXn4LFxQxdvT/11+kzfT/u234YacpUe6KyrxX+OqHJKJKLQRNFuh+m5xjP3LfTE/bVfy7WeKA/e2PL290uOfLbtdoaU0oKIqDqrrCNTJ6pMlUiJLKFYvqjT9o3L3T0wr7teNP8ryBAkyMiJnJKckpySnJJcJVevT7trwZx1fcmbTy5VdVQvQw0QQV2RJJGS0gQ5qSs6I/tnLMyWtlJmbb5nnlTnNtQQQaBOWQiBlJOEKESVTV0aFHOzuga2CpmUQQ2BgpRIkkDgv9GLJkcuWLDyUV3zOpWOWpm+7sih4zYt1QEZSpsICgIRgTBx9azVq+40ffWkVqtlxYoV2sOnDQzcq+fm39WePXt6aiglRARBCAA9favMzMwYHR01ODiou7vbunXrTE1NGc2rm092vzqVoSk0QRSaQlM4f/wHnWVSq9Vy9uxZ23a+b8sr7/r38hXLli2z9aHF1d69e6OG0g4lwoe/zUpCSeyYmFBVlf7+fq1Wy0e/zynYWpLJyUmXLl1y/vx5NbTbjaZh+aIO61tZCabbL7l89bS+oSFr1qzx/LlvtUuxZvVKY2NjDp+82fTSqqF9u5R2KTHbSL9cbpQUQuXpK6foXWtoaMj6xx4xMzPjwoULent79eeLVerunqhhbqYZnt9Z3bH74dn5EZEFBcfGlzpw4ICdb+1y5tQJw8PDNj21Ob784vM03iy59d03nzYpImzcdWhXey52pJQeD9EDIAiE8OzCH7tGRkac7Hp9vJRyInPwj/0v7P8f4TBXams7dlUAAAAASUVORK5CYII%3D',
		signatureReinsert:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKdSURBVBgZBcFLiFZlGADg5/3OmRlHbbwkpmQ37WZlmBYWIrnRRUnRolVQbcRN7Yp20SLauSvENgaB1C6KdpnlBbHMFl2IMsK7Ntg43mbm/8/53p4nMtO2dw+9Pj4x9koJGzEPAQIZZNXV+vfVK3kgrk29fXjPjgFAZKbnPjh6+NM3N64tJRYnjQQgE9LkjaH9J666dGbu1u+//rH0yJ4dc9BCaeKh0bZZ/Nu/mhJBkJU+q65LM8Pe1gdus+nB1vE6OT/rw1PPvvH1ku8/fH6uQEQszMxmtClGCm3QFJoggiJQrZwYteOple69f2y8nViwDwokAQUlKBFKhBKhRChNuPjfjHsWDj2yNOx85nbNSPMytACZtA0hZITaJyW0DaNZnLqSBrVT68CW1WOiLR20kEmijSKlRJQQyEo2hVFKDbU2UiEKKJCoiKBEKBFKhMgw0oSREr448YLPjm421hYVmUCB2pFJRSIzkUqhRGgb5rqhVcvW+uib9fpKX4EWak2ZSZIS7P12K9kb1M6g66xcssbaFZtcn73p1X336bvPQQt9pU+yUgFdHdj26Gv6rPraq9KF6bPWrdrsxmDGT7e2z3v8/ZlooXapZnrv54GQarCoG+izOn3lL8Pa6erQsB+6Nnfd+ru2uDG85fg/R2Zb6Lpe37NyYsSG5UVNDlyY1fWdOybu1tVen9XF6TOWLlzh5Nmjjv15OmfT4ha6uVq7WnPQi2PnezXSrW7gk2O7DerAbDewZtlaT6/e7sfTR5ybvmR8cs/NUx8/P9PCcLa/vGC0WfbOusGCzCyS+tgvYNF4C17ce6co4yavT/ly1w/TG3YePA8tROTu7W8deikinkg5H0CSSOnG8rmxc1PfxeLLX119ctfBk22xH/4HCmFTpxr5rC8AAAAASUVORK5CYII=',
		signatureRemove:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ2SURBVBgZBcFLiJVlGADg5/3+b87cbLyFNBJ4oexGQYqIi6hFQambgohoE0aLUqGCaBcuonWLUFe1CIJolWCLaiK1C0FUREpRBgmWNpqi4XjOnP97e57ITI+8fuLZ6bnJZ0rYhikECGSQzbi1M1cu5UJcvfzqycN7RgCRmXa9+dXJ9w5su6uUWJV0EoBMSIv/LXv/uyvOnx1eP/3zL2u+PLxnCBVKF3cMarfq1D+6EkGQjT6b8TgtLfceuv0mO7ZU37bFmWx3Xn5w/7HVx9/ePSwQESsysxt0xUShBl2hCyIoAs383MCe7fM23jY5Xedm34UCSUBBCUqEEqFEKBFKF/7+d8mGFcvuXhOe37lWN9E9CRUgk9oRQkZofVJC7Rhk8fulNGpjrY08sHlS1DKGCpkkahQpJaKEQDayKwwoLbTWSYUooEKiIYIQEolsTHSAKKIPWVJDJlChjcmkIZCZoBS0ULskgySFvtE3oEJrKTNJUgKQQAj950eMFg5ZPvebU+vW2zH9WGWnCn2jT7LRACRoyY2FI6ZOfeC+p54zuekeSz99YubkQv304YkDFdo4tUwHfxgJqQWZQSMjPX30Lbv3vmDqzBeceMPMylU2b9jg+1/z5Qrjca/vmZ+bsHVd0ZI+6YOWrL7yp6lbNrHrFQD14LyuxcYK42Fr49Zy1ItvzvVapBSgJetXzrv+4zGzR180XDrvOq5d7fSdvyos3+gvzA66m1+7dzSbmUXSACunq4vn9zt9/B23rp5WuwnXFsf+uNBJ/aHITNv3fbZvvJyPR8T9KWcAJImUHh0eq1sXP+zWDi/G1cHc8Oxgy8cvffT1E/8D2iAtJW5RUGAAAAAASUVORK5CYII%3D',
		facebookWhite:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAARxJREFUeNqUk11ugzAMx11qaBa2t20n6C6AuvtL6zuIMe0Q69soLSRpsjh8DFpaqKWQ2MrPMf84i/Tr+5mzYHcoCrjHeBjCoRQv+BDgTgrhAouZsLGDGGJxb09mqxVUZXlXBZ7nAbFojAF1Ok2fqjUopdzaDwLQliEW7RfcuGFaG1i/rSHk3PlZljVZTV2BmUjQh2vOdDNql+B2+S2cpp/DylwF9t8MjGeQUg58IUWtge93umC7GLP3zWbUT5KkiyEJNKXBxY00+4nFa+WTxXHs5iiKBv5/Q7UazKzgfF+nAWNsVoLzfVVV1X0grNq4XE4m0D2xVdOJHrd3TO9gTjv3YWKIxd/i+PrE2U+e51eBj+32IvZoXy+xfwIMAKS6sGlFXmC3AAAAAElFTkSuQmCC',
		twitterWhite:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVRJREFUeNqUU9uqgkAUXWMTgaUR1IOQfUT06s/7WvTWB1T4FF5ClKKLhzWwRTvW6SwYdZy91r6OqqoKm82mGg6H+A+KosBqtVJqvV5Xs9kMruui1+t9RX48HjifzzidTtC2bcNxHDyfTyilMBqNoLXG/X5Hnue43W6/BOiIDsuyhMUULMsyhhSi8na7NW8aUfh10ZYcw+VDFpX3+73xwjf3zfOupZubLnieV3/TexzHJgKx13LYJcBUmlgsFhiPx6Z4wqlToPpfOBwO6Pf7xlZ4lii9S+E1Agm/TuFTDZbLZWt/vV6RJEmriNYnARKaYOuaEZsuyA+pgQwRsdvtWgK+72MymSCKotphKwJ65Fi/w/F4xGAw6J4DemaPpe9slUQimM/nuFwurU5ozjPHlmPMu5CmKabTaWuABBTMssxMKDnkKqqEYVjxEn0LckgOgkD9CDAAr2lEEAopvPsAAAAASUVORK5CYII%3D'
	},
	images:{
		bcLogo:'data:image/gif;base64,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%3D',
		whiteHeart:'data:image/gif;base64,R0lGODlhEAAQAMQAAP////b5//H2/s/m/srd/LnS+7rS+6LR/4HA/3m8/3K5/1ut/0ul/2Ce+FqZ906P9T6J9iBw8v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEHABIALAAAAAAQABAAAAVQoCRBUQSJImmijwEAxiO2byw1wvsKjpPrgkZBpyMQiK8hcslsOp+vAVQ3SASmgYTkMD2gpM4BA8X4LQVjlGRhBi7UKMVSAVcjiIg6/A7Iw0MAOw%3D%3D',
		contributeButtonBg:'data:image/gif;base64,R0lGODlhBQAeALMAADOZ/S6U/j+e/IPB/nG3/CqQ/na6/DKZ/YTA/oa+/12u/32+/iqQ/4e+/wAAAAAAACH5BAAAAAAALAAAAAAFAB4AAAQpsMlJq704p72R90MYLiRpnCehqkrbCjB8zDNg20GeFzzP/MCgcEgsGiMAOw%3D%3D',
		facebookPage:'data:image/gif;base64,R0lGODlhkAAsANUAAMDI122Ds5SjwkZinFFsoomaveLk6Kq1zWF5rF11p36Rt87W5cvR3dfa4nOHsrW/0p+sx2yDsZ2sy9vg7LO+1+fq8ldxp9rg7LbB2PP1+cLL30djnmB4q3iNuGh+rezs7Orq6pOTk8zMzP///ztZl+3t7QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAACQACwAAAb/QJFwSCwaj8ikcslsOp/Q5GhKrVqv2Kx2y+16v+DwVQgqm8/otHrNbrvf8Lh8nhaW7vi8fs/v+/+AgYKDhIV7doaJiouMjY4liI+Sk5SVf5F3BwMknJ2en6ChAweJBgQOgiQelqyXInqbobKznwOBHp8MJASpq62/epgltMTEtyQJHsolDA29wNB3wsXUoccAeaoluAqcvpqdvngA2tskzAmdeg8E3gbDqpwKwNPVoREdEhERG57X2atwEVCw6QE5EgoclBtXDleJdglR4Wkgr90qTgkcbGLwq569ThIyWIngDxCuTti0OSwhgISAAi7vLLxDzpdDTtj0wCxQwgAn/5/nSsDMycrjRwxYSKoziUwZR5VBWwrAlXNmiZp3HJ4k8CAP1awkDt5pSdSS0WoRsijl9A8P1LEuvw4TR7PhOQMC2pFwBrZriXRiWYbt+CrbRxIa1Jb8I1dmwKguuwnoaZVcgjvpmGEefGdnCYq22AouW+kstQVVOMhq69gcXAEHvG2iKxOZ3hKzOfH9LJsET9FkCes5TAL1lAuzAhXwwBGPB57LM3kgJWDAgOU89RwgMECBglUKLPrF80Dg5G3fmAs3/NH4iAXJo8mnV9jtYffwV8/fb7Z+bWoSBFgBFRUEGOBaQfGn4COmzdIFggsGcoAHA5A2yXIJAtKgLA8u9v8HACCGCGJzlrTEmSUnDbJhKB0uBYgstE1iooWSpCjIiqC0KNqLocQoyYyt2BgIjrLgFx+PYYnYnAEg7rZHk3swAMA7eAApZR9MkhjllHoIeZUfRIZipH5I8qFXJw4QZUA3nQzQXHXh8GViAWdmdwcDJ5FwHZVjxYIMUULC5BsfYYIypjWBuMjeJ3ikw2gJbHpCwDsmgnIeA36Gg0eknuRkY2x68plHoZ8cCkoqO+ZRgAAPPAAnZHqu+t1VGDWwJifUcUIABAAoFOpDnKQJDgmkgDpKr7qCdY4uemo5qn/wtEdFfogi6YmPNupFmqCk8IaQYCdqe9BlmQRrDrF46MX/0UkNxDLeIdASZ+qj1mq6h42c2NIlJ7yC6A24RAkKgYnneRtaqgKf6ygErgx337RH/hGOMs9l4sCZbB0UI8bXAlwlJwIQzF60eYicJ8gNG4ZAACy37PLLE1AxwcsBIJCqH4rCZY3Ge8SSDMUVA6nzwCjbd46iJoPiZDDxkrAyzVAHEPMUM79sc4Y434ybnp6yBRTW59IodAm+AiDyHRTtQvKmuCosqI/SNP101DDLTPPVqIL9r7J36MUw2pAWDbjHPcViwAPJ6jzPSd0aEIszJ72jbR/1zE13y1OPULXLeCeqdb4GvfpcpQ5MRQKTnSQggALpcGSiBxBA4Og8wJLgxMADgg5mLAQHOGqTaKDyQmjTFiBg/PHIJ0/BAsxTkDwCFmjNR87n9miAo50KFQrDEISSAJWIg2In9m3yJaSj3TINC3HF6GvSMnoY4CtCAPjdU16p59R7m2lK16YCogJAnhLwLrzEojt8Wo44DkI79eVhWOwTRfoiREFDCKOCGMxg3D7AwQ568IMgDKEIR0jCEprwhChMoQpBeEENunBBLXyhDOUTwxnasBUiCIEOd8jDHvrwh0AMohCHSMQiGvGISARiEAAAOw%3D%3D'
	},
	//---------------------- getVersion -----------------
	getVersion:function() {
		switch(com.BlankCanvas.BrowserDetect.browser) {
			case 'Firefox':
				// get current version
				/*
				var em = Components.classes["@mozilla.org/extensions/manager;1"]
						 .getService(Components.interfaces.nsIExtensionManager);
				var addon = em.getItemForID("gmail_sigs@blankcanvasweb.com");
				return addon.version;
				*/
				return false;
				break;
			case 'Chrome':
				return false;
				break;
		}
	},
	getPref:function(key) {
		var bcgs = com.BlankCanvas.GmailSignatures;
		switch(com.BlankCanvas.BrowserDetect.browser) {
			case 'Firefox':
				try { return bcgs.prefs.getIntPref("extension.bcGmailSigs." + key); } catch(e) {
					try { return bcgs.prefs.getCharPref("extension.bcGmailSigs." + key); } catch(e) {
						try { return bcgs.prefs.getBoolPref("extension.bcGmailSigs." + key); } catch(e) {
							return null;	
						}
					}
				}
				break;
			case 'Chrome':
				return typeof(localStorage['extension.bcGmailSigs.' + key]) != 'undefined' ? localStorage['extension.bcGmailSigs.' + key] : null; 
				break;
		}
	},
	//---------------------- getSignature -----------------
	getSignature:function(key) {
		function getFromBookmark() {
			var sigContainer = bcgs.getDataBookmarkObject();
			return typeof(sigContainer[key]) != 'undefined' ? sigContainer[key] : '';
		}
		
		var bcgs = com.BlankCanvas.GmailSignatures;
		var sig = unescape(bcgs.getPref(key));
		sig = sig != 'null' ? sig : '';
		if (bcgs.getPref('storageMethod') == 'bookmark' && com.BlankCanvas.BrowserDetect.browser == 'Firefox') {
			// bookmark storage method
			var sigFromBookmark = getFromBookmark();
			if(sigFromBookmark != '')
				sig = sigFromBookmark;
			else 
				// store the signature to the data bookmark if it exists in local storage
				if (sig != '') { 
					bcgs.saveSignature(sig, key);
					bcgs.setCharPref(key, '');		// remove the local method
				}
		} else {
			// local storage method
			// store the signature from data bookmark to local storage if found
			var sigFromBookmark = getFromBookmark();
			if(sig == '' && sigFromBookmark != '') {
				sig = sigFromBookmark;
				bcgs.saveSignature(sig, key);
			}
		}
		return sig;
	},
	//---------------------- saveSignature -----------------
	saveSignature:function(sigKey, signature) {
		var bcgs = com.BlankCanvas.GmailSignatures;
		if(bcgs.getPref('storageMethod') == 'bookmark' && com.BlankCanvas.BrowserDetect.browser == 'Firefox') {
			var sigContainer = bcgs.getDataBookmarkObject();
			//sigContainer[sigKey] = escape(signature.replace(/"/g, '\\"').replace(/\n/g, "[BCGSNL]"));
			sigContainer[sigKey] = signature;
			var stringifiedData = JSON.stringify(sigContainer);
			var bookmarkId = bcgs.getDataBookmarkId();
			com.BlankCanvas.FirefoxBookmarkManager.setTitle(bookmarkId, "BC Gmail Signatures Data: " + stringifiedData);
		} else
			bcgs.setCharPref(sigKey, escape(signature));
	},
	//---------------------- setPref -----------------
	setCharPref:function(key, val) {
		var bcgs = com.BlankCanvas.GmailSignatures;
			switch(com.BlankCanvas.BrowserDetect.browser) {
				case 'Firefox':
					bcgs.prefs.setCharPref("extension.bcGmailSigs." + key, val);
					break;
				case 'Chrome':
					localStorage['extension.bcGmailSigs.' + key] = val;
					break;
			}
	},
	getText:function(key) {
		var bcgs = com.BlankCanvas.GmailSignatures;
		switch(com.BlankCanvas.BrowserDetect.browser) {
			case 'Firefox':
				try {
					return bcgs.localeText.getString(key);
				} catch(e) {
					return bcgs.localeTextEn.getString(key);
				}
				break;
			case 'Chrome':
				return typeof(bcgs.localeText[key]) != 'undefined' ? bcgs.localeText[key] : '';
				break;
		}
	} 
}