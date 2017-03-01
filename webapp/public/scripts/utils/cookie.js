var Cookie = {
    set: function(name, value, days) {
        var expires = '';
        if (days) {
            var fix = 0;
            var date = new Date();
            if (days === 'today') {
                days = 1;
                fix = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
            }
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000) - fix * 1000);
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    },

    get: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    },

    del: function(name) {
        this.set(name, '', -1);
    }
};
export default Cookie;