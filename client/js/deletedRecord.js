var json2csv = require('json2csv');
var json2xls = require('json2xls');

var fields = [
    'id',
    'createdAt',
    'updatedAt',
    'location',
    'type',
    'name',
    'email',
    'residentName',
    'phone',
    'checkedOut',
    'checkedIn',
    'deleted',
    'plus18',
    'sendPromotions',
    'selfCheckIn',
    '_v',
    'updatedBy',
    'checkedInAt',
    'checkedInBy',
    'checkedOutAt',
    'checkedOutBy',
    'deletedAt',
    'deletedBy'];
var fs = require('fs');

var ObjectId = function (x) {
    return x;
};
var ISODate = function (x) {
    return x;
};

var admin = [
    {

        "_id" : ObjectId("555b51df0a85e9b82e815f6f"),

        "createdAt" : ISODate("2015-05-19T15:08:16.020Z"),

        "updatedAt" : ISODate("2015-06-03T06:32:54.220Z"),

        "email" : "admin@erlystage.com",

        "password" : "$2a$05$KhCcsuUwDrX4Pk5dhGeceunuBuiG7wntZJL4xm9Z3n8SGYWc4h87a",

        "username" : "Super Admin",

        "deleted" : false,

        "permissions" : [

            "manage",

            "frontdesk"

        ],

        "role" : "admin",

        "__v" : 0,

        "defaultLocation" : "Spitalfields"

    },

    {

        "_id" : ObjectId("555b51e00a85e9b82e815f70"),

        "createdAt" : ISODate("2015-05-19T15:08:16.039Z"),

        "updatedAt" : ISODate("2015-06-03T06:32:45.290Z"),

        "email" : "front@erlystage.com",

        "password" : "$2a$05$8zFujPpm.b6Cpa/Mw/pO0.GBtR30ol6FT5R0cpfyPupuosJ1jK1GC",

        "username" : "Front Desk User",

        "deleted" : false,

        "permissions" : [

            "frontdesk"

        ],

        "role" : "frontdesk",

        "__v" : 0,

        "defaultLocation" : "Spitalfields"

    },

    {

        "_id" : ObjectId("555d8f2071320040670b370b"),

        "createdAt" : ISODate("2015-05-21T07:54:08.673Z"),

        "updatedAt" : ISODate("2015-05-21T07:54:08.673Z"),

        "username" : "Ruta Drukteinyte",

        "email" : "ruta.drukteinyte@greystar.com",

        "password" : "$2a$05$XmBjvA/tsfk5520j9.E6w.pJakVP3dzTcFbQTaQj7ojIZvNR3Xo0i",

        "defaultLocation" : "Spitalfields",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f1d71320040670b370a"),

        "createdAt" : ISODate("2015-05-21T07:54:08.629Z"),

        "updatedAt" : ISODate("2015-05-21T07:54:08.629Z"),

        "username" : "Mirjana Messerer",

        "email" : "mirjana.messerer@greystar.com",

        "password" : "$2a$05$3R/tY24kG6WRodBgvF3HXOMEiFPKXHoGOJs8JUx4JXjhWT/39DSjK",

        "defaultLocation" : "Spitalfields",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b370c"),

        "createdAt" : ISODate("2015-05-21T07:54:08.724Z"),

        "updatedAt" : ISODate("2015-05-21T07:54:08.724Z"),

        "username" : "Martin Kolev",

        "email" : "martin.kolev@greystar.com",

        "password" : "$2a$05$kB.Ot7PVzXp/PhlZQ0wFNu6dqiPOSRGMGTx3KVjEECzPB9NEK3OLW",

        "defaultLocation" : "Spitalfields",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b370d"),

        "createdAt" : ISODate("2015-05-21T07:54:08.765Z"),

        "updatedAt" : ISODate("2015-05-28T07:21:49.345Z"),

        "username" : "Spitalfields Security",

        "email" : "securitymx@greystar.com",

        "password" : "$2a$05$gUQUAdRM80GZo.RvXK7l.ecueUIh8R2aUIg07QckvzPprseSJrzJK",

        "defaultLocation" : "Spitalfields",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b370e"),

        "createdAt" : ISODate("2015-05-21T07:54:08.819Z"),

        "updatedAt" : ISODate("2015-05-21T07:54:08.819Z"),

        "username" : "Leandro Mutti",

        "email" : "leandro.mutti@greystar.com",

        "password" : "$2a$05$MBWo7yjgz6jHAGFzrurWP.GPvi3ODO.gxXzwE7mnx0Ckz.Szn.Pui",

        "defaultLocation" : "Kings Cross",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b3710"),

        "createdAt" : ISODate("2015-05-21T07:54:08.944Z"),

        "updatedAt" : ISODate("2015-05-21T07:54:08.944Z"),

        "username" : "Mudassir Bundhoo",

        "email" : "mudassir.bundhoo@greystar.com",

        "password" : "$2a$05$kR3psQXocla3XdvGC6dITeIvSjjY4K5UubjmOwKljhugoBe5ULrwO",

        "defaultLocation" : "Kings Cross",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b370f"),

        "createdAt" : ISODate("2015-05-21T07:54:08.883Z"),

        "updatedAt" : ISODate("2015-05-21T07:54:08.883Z"),

        "username" : "Michele von Euw",

        "email" : "michele.voneuw@greystar.com",

        "password" : "$2a$05$Rl2hNG/hA8dGjBJmWGCtxutgvtJGVV7rjf1eyRJ.5A5S/QWnIVLAG",

        "defaultLocation" : "Kings Cross",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b3711"),

        "createdAt" : ISODate("2015-05-21T07:54:09.002Z"),

        "updatedAt" : ISODate("2015-05-28T07:22:30.599Z"),

        "username" : "King’s Cross Security",

        "email" : "securitykx@greystar.com",

        "password" : "$2a$05$gmK/YGumVRkolEAWaosY1OHch0rrf4XTjd2hsumWshP9jQbtnJyaG",

        "defaultLocation" : "King's Cross",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b3712"),

        "createdAt" : ISODate("2015-05-21T07:54:09.082Z"),

        "updatedAt" : ISODate("2015-05-21T07:54:09.082Z"),

        "username" : "Martyn Duguid",

        "email" : "martyn.duguid@greystar.com",

        "password" : "$2a$05$DTfSBgKo.XDCLkIwIuUZa.L23WFowwSiZVZAaUbaCGva9AeSvFH96",

        "defaultLocation" : "Kings Cross",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b3715"),

        "createdAt" : ISODate("2015-05-21T07:54:09.242Z"),

        "updatedAt" : ISODate("2015-05-21T07:54:09.242Z"),

        "username" : "Jo Haslock",

        "email" : "jo.haslock@greystar.com",

        "password" : "$2a$05$5BpbGa/kp7O6kljXUBnlcuRPZj1NBNqdwBM7sc/XMzZ6tDUbVaAnG",

        "defaultLocation" : "Notting Hill",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b3714"),

        "createdAt" : ISODate("2015-05-21T07:54:09.195Z"),

        "updatedAt" : ISODate("2015-05-21T07:54:09.195Z"),

        "username" : "Natasha Prendergast",

        "email" : "natasha.prendergast@greystar.com",

        "password" : "$2a$05$iJHJXqzrIFbVWh0WEiCaRObmI1xv5H8I2sK0J3Uu4iZlP24MLF/1e",

        "defaultLocation" : "Notting Hill",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b3716"),

        "createdAt" : ISODate("2015-05-21T07:54:09.286Z"),

        "updatedAt" : ISODate("2015-05-28T07:23:04.233Z"),

        "username" : "Notting Hill Security",

        "email" : "securitynh@greystar.com",

        "password" : "$2a$05$2EKhDSQRHIPbYYY7IiIIYeOr3Jr70sIwYiho6.6sM5H40W17dWYj6",

        "defaultLocation" : "Notting Hill",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d947480d6d31c68b22f17"),

        "createdAt" : ISODate("2015-05-21T08:16:52.229Z"),

        "updatedAt" : ISODate("2015-05-21T08:16:52.229Z"),

        "username" : "Mustafa Farooq",

        "password" : "$2a$05$wYkn34Vm4psuQTzLEP0FgOZmVMuumuG90ecuNd7LwFFLAadB.2Goa",

        "email" : "mustafa.farooq@greystar.com",

        "defaultLocation" : "Notting Hill",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("555d8f2071320040670b3717"),

        "createdAt" : ISODate("2015-05-21T07:54:09.330Z"),

        "updatedAt" : ISODate("2015-08-07T10:54:54.751Z"),

        "username" : "SuperAdmin",

        "email" : "admin@greystar.com",

        "password" : "$2a$05$gq5Um3hHnOdXN1JcMvyeKehjF5TOkimnF5w8uuJyGLz.N1hX9/TIm",

        "defaultLocation" : "Notting Hill",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "admin",

        "__v" : 0

    },

    {

        "_id" : ObjectId("5565eabc2cac545147fd13d9"),

        "createdAt" : ISODate("2015-05-27T16:03:08.553Z"),

        "updatedAt" : ISODate("2015-05-27T16:03:08.553Z"),

        "username" : "Ali",

        "email" : "ali.sheikh@greystar.com",

        "password" : "$2a$05$Cz6WM2Jc4II2jJT24TIouOdjjC3KuVKwHjTldhP6jQPgXuteBXyke",

        "defaultLocation" : "Notting Hill",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("559bcd72184083992e4cf7e1"),

        "createdAt" : ISODate("2015-07-07T13:00:34.365Z"),

        "updatedAt" : ISODate("2015-07-07T13:00:34.365Z"),

        "username" : "Demo User",

        "email" : "demo@erlystage.com",

        "password" : "$2a$05$KUGE0gB4Gg6t/Rnc1bArWeOizo84d9H.dh8OaiQcXucIHu4WmTM0y",

        "defaultLocation" : "Spitalfields",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "admin",

        "__v" : 0

    },

    {

        "_id" : ObjectId("55c3094501e89846655a167e"),

        "createdAt" : ISODate("2015-08-06T07:14:13.924Z"),

        "updatedAt" : ISODate("2015-08-06T07:14:13.924Z"),

        "username" : "test t",

        "email" : "test@t.com",

        "password" : "$2a$05$VaHG50RLmJwNqsSD0/IuOeViK1OwoCzX6RLLwSHTwOSf9erjmJO8m",

        "defaultLocation" : "Notting Hill",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    },

    {

        "_id" : ObjectId("55c30c2801e89846655a167f"),

        "createdAt" : ISODate("2015-08-06T07:26:32.537Z"),

        "updatedAt" : ISODate("2015-08-07T10:32:17.140Z"),

        "username" : "nottinghill test",

        "email" : "test@nottinghill.com",

        "password" : "$2a$05$CA.tujmum/eKTte4DMWuZuzMwefcmbLfU0kt8FhkLaBFZjo3QA6gC",

        "defaultLocation" : "Notting Hill",

        "deleted" : false,

        "permissions" : [ ],

        "role" : "frontdesk",

        "__v" : 0

    }
];
var data = [
    {

        "_id" : ObjectId("55c4671401e89846655a16c8"),

        "createdAt" : ISODate("2015-08-07T08:06:44.520Z"),

        "updatedAt" : ISODate("2015-08-11T19:12:04.748Z"),

        "location" : "Notting Hill",

        "type" : "Parent",

        "name" : "Bhavna Shah",

        "email" : "bhavnashah2968@yahoo.in",

        "residentName" : "Miloni Shah",

        "phone" : "+4477405020621",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:53.663Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:46:57.212Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:12:04.747Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c478ed01e89846655a16cc"),

        "createdAt" : ISODate("2015-08-07T09:22:53.676Z"),

        "updatedAt" : ISODate("2015-08-11T19:12:02.442Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Reinhard Mueller",

        "email" : "sonnenrain@freenet.de",

        "phone" : "+447832969695",

        "residentName" : "Lorena Mueller",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:55.620Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:00.103Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:12:02.441Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c4791101e89846655a16cd"),

        "createdAt" : ISODate("2015-08-07T09:23:29.947Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:59.896Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Gisela Mueller",

        "email" : "sonnenrain@freenet.de",

        "phone" : "+447832969695",

        "residentName" : "Lorena Mueller",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:47:03.432Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:05.577Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:59.896Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c4e74401e89846655a16f2"),

        "createdAt" : ISODate("2015-08-07T17:13:40.679Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:56.262Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Lionel Schreck",

        "email" : "lionel.schreck@gmail.com",

        "phone" : "+32496371256",

        "residentName" : "Pierre Schoonbroodt",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:47:09.950Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:10.988Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:56.261Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c4eafb01e89846655a16f7"),

        "createdAt" : ISODate("2015-08-07T17:29:31.102Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:53.988Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "Celine Lanting",

        "email" : "celine.lanting@gmail.com",

        "phone" : "+31683267349",

        "residentName" : "Yvette Lanting",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:47:16.024Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:17.110Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:53.987Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c4f12f01e89846655a16fc"),

        "createdAt" : ISODate("2015-08-07T17:55:59.141Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:51.596Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "OZDE DEPREM",

        "email" : "depremozde@hotmail.com",

        "phone" : "+447983209096",

        "residentName" : "seda karaca",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : false,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:47:24.015Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:25.580Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:51.595Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c518f401e89846655a1738"),

        "createdAt" : ISODate("2015-08-07T20:45:40.421Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:49.014Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Robert Shaw",

        "email" : "rljshaw@gmail.com",

        "phone" : "+447801064659",

        "residentName" : "Abigail Milnor-Sweetser",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:47.572Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:27.523Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:49.013Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c5599501e89846655a1772"),

        "createdAt" : ISODate("2015-08-08T01:21:25.720Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:46.462Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "James Hunter",

        "email" : "james-hunter-1@hotmail.co.uk",

        "phone" : "+447590438565",

        "residentName" : "Madison Davenport",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:42.737Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:29.597Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:46.461Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c57a1e01e89846655a1778"),

        "createdAt" : ISODate("2015-08-08T03:40:14.254Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:43.936Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "swati shetty",

        "email" : "swati.shetty74@gmail.com",

        "phone" : "+447831789929",

        "residentName" : "Alisha Sachdev",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:40.737Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:34.703Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:43.936Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c5dd6401e89846655a177f"),

        "createdAt" : ISODate("2015-08-08T10:43:48.259Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:41.392Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Neele Brzelinski",

        "email" : "neele.brzelinski@gmail.com",

        "phone" : "+4915776361435",

        "residentName" : "Annalena Thomsen",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:39.070Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:36.860Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:41.391Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c5e5cd01e89846655a1783"),

        "createdAt" : ISODate("2015-08-08T11:19:41.581Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:38.891Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Daniel Brennan",

        "email" : "danielabrennan@icloud.com",

        "phone" : "+447542322047",

        "residentName" : "Noah Galicia",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:37.118Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:40.021Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:38.891Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c62ad101e89846655a179b"),

        "createdAt" : ISODate("2015-08-08T16:14:09.103Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:36.598Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "ashton payne",

        "email" : "ashtonpayne@yahoo.com",

        "residentName" : "eugene merkert",

        "phone" : "+447479843533",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:35.471Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:53.438Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:36.597Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c6370f01e89846655a17a2"),

        "createdAt" : ISODate("2015-08-08T17:06:23.075Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:34.570Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "Celine Lanting",

        "email" : "celine.lanting@gmail.com",

        "phone" : "+31683267349",

        "residentName" : "Yvette Lanting",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:33.697Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:52.653Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:34.569Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c6390801e89846655a17a3"),

        "createdAt" : ISODate("2015-08-08T17:14:48.293Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:30.607Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "swati shetty",

        "email" : "swati.shetty74@gmail.com",

        "residentName" : "alisha sachdev",

        "phone" : "+44 7831789929",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:29.142Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:51.987Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:30.606Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c65eed01e89846655a17bc"),

        "createdAt" : ISODate("2015-08-08T19:56:29.514Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:27.972Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Lionel Schreck",

        "email" : "lionel.schreck@gmail.com",

        "phone" : "+32496371256",

        "residentName" : "pierre schoonbroodt",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:26.850Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:47:51.116Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:27.971Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c6796e01e89846655a17e3"),

        "createdAt" : ISODate("2015-08-08T21:49:34.586Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:25.470Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "Cathy Feng",

        "email" : "12114036d@connect.polyu.hk",

        "phone" : "+85268049248",

        "residentName" : "Vivian Cheng",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:23.101Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:49:07.313Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:25.470Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c67b2901e89846655a17e6"),

        "createdAt" : ISODate("2015-08-08T21:56:57.570Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:22.828Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "Mahak Bokhari",

        "email" : "sinan_786@hotmail.co.uk",

        "phone" : "+94777717786",

        "residentName" : "Sinan Muhammed",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:25.003Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:49:09.126Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:22.827Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c748b601e89846655a1816"),

        "createdAt" : ISODate("2015-08-09T12:33:58.262Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:20.489Z"),

        "location" : "Notting Hill",

        "type" : "Not A Student",

        "name" : "Ian Jenkins",

        "email" : "whatup532@ca.rr.com",

        "phone" : "+19498702109",

        "residentName" : "Elizabeth Hofeld",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:17.139Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:49:11.887Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:20.487Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c776de01e89846655a1828"),

        "createdAt" : ISODate("2015-08-09T15:50:54.991Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:18.023Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Olufemi Odunowo",

        "email" : "femi.odunowo@gmail.com",

        "phone" : "+447876269531",

        "residentName" : "Melissa Adjiputro",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:13.809Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:49:18.848Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:18.022Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c78b3a01e89846655a1833"),

        "createdAt" : ISODate("2015-08-09T17:17:46.139Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:15.351Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "Celine Lanting",

        "email" : "celine.lanting@gmail.com",

        "phone" : "+31683267349",

        "residentName" : "Yvette Lanting",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:11.897Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:49:18.109Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:15.350Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c7974301e89846655a183b"),

        "createdAt" : ISODate("2015-08-09T18:09:07.634Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:06.209Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "sharlene cruz",

        "email" : "sharlenecruz94@aim.com",

        "phone" : "+19176923600",

        "residentName" : "ANGELICA WILLIAMS",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-09T18:46:09.752Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-09T18:49:17.321Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:06.208Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c7e3d201e89846655a185b"),

        "createdAt" : ISODate("2015-08-09T23:35:46.444Z"),

        "updatedAt" : ISODate("2015-08-11T19:11:02.001Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "swati shetty",

        "email" : "swati.shetty74@gmail.com",

        "residentName" : "alisha sachdev",

        "phone" : "+44 7831789929",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-10T18:55:46.782Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-10T18:55:48.949Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:11:01.991Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55c8eac601e89846655a188f"),

        "createdAt" : ISODate("2015-08-10T18:17:42.868Z"),

        "updatedAt" : ISODate("2015-08-11T19:10:58.875Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Paul Chauchat",

        "email" : "paul.chauchat@student.ecp.fr",

        "phone" : "+44719645267",

        "residentName" : "Fqtine Qbdoussi",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : false,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-10T18:55:50.728Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-10T18:55:52.253Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T19:10:58.874Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55ca662b01e89846655a1906"),

        "createdAt" : ISODate("2015-08-11T21:16:27.324Z"),

        "updatedAt" : ISODate("2015-08-11T22:55:31.542Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "sean toner",

        "email" : "blueninja.st@gmail.com",

        "residentName" : "eugene merkert",

        "phone" : "+447527826038",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedInAt" : ISODate("2015-08-11T22:55:24.844Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "checkedOutAt" : ISODate("2015-08-11T22:55:25.459Z"),

        "checkedOutBy" : ObjectId("555d947480d6d31c68b22f17"),

        "deletedAt" : ISODate("2015-08-11T22:55:31.540Z"),

        "deletedBy" : ObjectId("555d947480d6d31c68b22f17")

    },

    {

        "_id" : ObjectId("55cb671101e89846655a1932"),

        "createdAt" : ISODate("2015-08-12T15:32:33.573Z"),

        "updatedAt" : ISODate("2015-08-14T01:06:45.196Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Vatsal L",

        "email" : "vatsal.lapasia@gmail.com",

        "residentName" : "Neha D",

        "phone" : "+447448969747",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-12T19:14:54.081Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T01:06:23.605Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T01:06:45.195Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cb8f7001e89846655a194a"),

        "createdAt" : ISODate("2015-08-12T18:24:48.875Z"),

        "updatedAt" : ISODate("2015-08-14T01:06:49.135Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "daniel brennan",

        "email" : "danielabrennan@icloud.com",

        "phone" : "+447542322047",

        "residentName" : "david cava",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-12T18:26:23.679Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T01:06:28.463Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T01:06:49.133Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cba5b801e89846655a195e"),

        "createdAt" : ISODate("2015-08-12T19:59:52.697Z"),

        "updatedAt" : ISODate("2015-08-14T01:06:51.896Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Mehdi Benhalima",

        "email" : "mehdibenhalima25@gmail.com",

        "phone" : "+447849290381",

        "residentName" : "Fatine Abdoussi",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : false,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-12T20:01:24.678Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T01:06:30.681Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T01:06:51.896Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cd044601e89846655a19c8"),

        "createdAt" : ISODate("2015-08-13T20:55:34.737Z"),

        "updatedAt" : ISODate("2015-08-14T01:06:54.869Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "christine wetzel",

        "email" : "wetzel.christine91@gmail.com",

        "phone" : "+4740470608",

        "residentName" : "caroline wetzel",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-13T20:57:59.722Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T01:06:32.754Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T01:06:54.868Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cd04ba01e89846655a19c9"),

        "createdAt" : ISODate("2015-08-13T20:57:30.065Z"),

        "updatedAt" : ISODate("2015-08-14T01:06:57.311Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "Andreas Wetzel",

        "email" : "andreas-wetzel@hotmail.com",

        "phone" : "+4741274614",

        "residentName" : "caroline wetzel",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-13T20:57:58.660Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T01:06:34.827Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T01:06:57.310Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cd124001e89846655a19ca"),

        "createdAt" : ISODate("2015-08-13T21:55:12.363Z"),

        "updatedAt" : ISODate("2015-08-14T01:06:59.681Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Ann Glackin",

        "email" : "scarlett.glackin@gmail.com",

        "residentName" : "Stephen Kime",

        "phone" : "+15713290098",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T01:06:18.872Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T01:06:38.843Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T01:06:59.680Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cd1d7d01e89846655a19ce"),

        "createdAt" : ISODate("2015-08-13T22:43:09.950Z"),

        "updatedAt" : ISODate("2015-08-14T01:07:01.829Z"),

        "location" : "Notting Hill",

        "type" : "Not A Student",

        "name" : "Luke Graham",

        "email" : "luke@niceandpolite.com",

        "residentName" : "Katie Lugo",

        "phone" : "+447707288174",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T01:06:16.004Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T01:06:40.859Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T01:07:01.828Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cdd28e01e89846655a19eb"),

        "createdAt" : ISODate("2015-08-14T11:35:42.048Z"),

        "updatedAt" : ISODate("2015-08-14T21:40:53.401Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "Ilaria Supino",

        "email" : "supino.ilaria@gmail.com",

        "phone" : "+393486575748",

        "residentName" : "Marcello Zompi",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T21:39:58.220Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:40:50.601Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:40:53.400Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce3f8201e89846655a1a26"),

        "createdAt" : ISODate("2015-08-14T19:20:34.222Z"),

        "updatedAt" : ISODate("2015-08-14T21:40:09.912Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "Celine Lanting",

        "email" : "celine.lanting@gmail.com",

        "phone" : "+31683267349",

        "residentName" : "Yvette Lanting",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T19:45:55.621Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:40:03.216Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:40:09.910Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce412601e89846655a1a2b"),

        "createdAt" : ISODate("2015-08-14T19:27:34.501Z"),

        "updatedAt" : ISODate("2015-08-14T21:40:40.587Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "jacquelyn holder",

        "email" : "jacquelynholder1@gmail.com",

        "residentName" : "Adam Friedman",

        "phone" : "+442036759220",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-14T19:45:58.595Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:40:37.761Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:40:40.586Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce463801e89846655a1a31"),

        "createdAt" : ISODate("2015-08-14T19:49:12.708Z"),

        "updatedAt" : ISODate("2015-08-14T21:40:17.465Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Sam Va Wetter",

        "email" : "svaaanwetter@gmail.com",

        "phone" : "+447479841469",

        "residentName" : "Ida Esmeili",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T19:51:01.556Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:40:12.362Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:40:17.464Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce470401e89846655a1a32"),

        "createdAt" : ISODate("2015-08-14T19:52:36.182Z"),

        "updatedAt" : ISODate("2015-08-14T21:40:25.675Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Bill Sturtevant",

        "email" : "reed@coho.netq",

        "residentName" : "ida esmeili",

        "phone" : "+44 203 675 9220",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T19:53:03.654Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:40:22.741Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:40:25.674Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce476401e89846655a1a34"),

        "createdAt" : ISODate("2015-08-14T19:54:12.743Z"),

        "updatedAt" : ISODate("2015-08-14T21:40:33.337Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Carene Rose Mekertichyan",

        "email" : "carenerose@pacbell.net",

        "residentName" : "Ida Esmaeilli",

        "phone" : "+447482391586",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T19:54:29.815Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:40:28.690Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:40:33.336Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce47a801e89846655a1a35"),

        "createdAt" : ISODate("2015-08-14T19:55:20.897Z"),

        "updatedAt" : ISODate("2015-08-14T21:40:46.404Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Veronica Burt",

        "email" : "burt.veronica@gmail.com",

        "phone" : "+447479841310",

        "residentName" : "Ida Esmaeli",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-14T19:55:34.444Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:40:43.850Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:40:46.403Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce4c9401e89846655a1a3c"),

        "createdAt" : ISODate("2015-08-14T20:16:20.867Z"),

        "updatedAt" : ISODate("2015-08-14T21:40:59.600Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Philip Son",

        "email" : "phil.s9915@gmail.com",

        "residentName" : "angelica williams",

        "phone" : "+447708598551",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T20:16:37.817Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:40:55.921Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:40:59.599Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce4fa301e89846655a1a3f"),

        "createdAt" : ISODate("2015-08-14T20:29:23.508Z"),

        "updatedAt" : ISODate("2015-08-14T21:41:04.222Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Anna Forte",

        "email" : "annaforte@gmail.com",

        "residentName" : "andres mesa",

        "phone" : "+447885964569",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T21:39:53.526Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:41:01.915Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:41:04.221Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce52e601e89846655a1a49"),

        "createdAt" : ISODate("2015-08-14T20:43:18.699Z"),

        "updatedAt" : ISODate("2015-08-14T21:41:09.336Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "residentName" : "Madison Davenport",

        "name" : "Carina Conti",

        "email" : "carina.a.s.conti.16@dartmouth.edu",

        "phone" : "+442036759220",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T21:39:49.081Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:41:06.349Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:41:09.335Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce53d301e89846655a1a4f"),

        "createdAt" : ISODate("2015-08-14T20:47:15.934Z"),

        "updatedAt" : ISODate("2015-08-14T21:41:14.149Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "yui yamazoe",

        "email" : "yuiyui.104@docomo.ne.jp",

        "phone" : "+8109090057981",

        "residentName" : "Lapo Nidiaci",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T21:39:46.188Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:41:11.524Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:41:14.148Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce540601e89846655a1a51"),

        "createdAt" : ISODate("2015-08-14T20:48:06.473Z"),

        "updatedAt" : ISODate("2015-08-14T21:41:18.847Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Patricia Garcia",

        "email" : "patgarllo@gmail.com",

        "phone" : "+34610810324",

        "residentName" : "Lapo Nidiaci",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T21:39:43.452Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:41:16.043Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:41:18.846Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce543a01e89846655a1a55"),

        "createdAt" : ISODate("2015-08-14T20:48:58.391Z"),

        "updatedAt" : ISODate("2015-08-14T21:41:24.009Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "felice nitti",

        "email" : "felicenitti@icloud.com",

        "phone" : "+393337393563",

        "residentName" : "Lapo Nidiaci",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T21:39:40.524Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:41:21.102Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:41:24.008Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce571d01e89846655a1a5e"),

        "createdAt" : ISODate("2015-08-14T21:01:17.060Z"),

        "updatedAt" : ISODate("2015-08-14T21:41:28.494Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "michaela murphy",

        "email" : "michaela.murphy@yale.edu",

        "phone" : "+448186690847",

        "residentName" : "madison davenport",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T21:39:37.193Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:41:26.325Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:41:28.493Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce617001e89846655a1a75"),

        "createdAt" : ISODate("2015-08-14T21:45:20.034Z"),

        "updatedAt" : ISODate("2015-08-14T21:49:09.380Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Sodein Graham-Douglas",

        "email" : "sodeinfierce@yahoo.com",

        "residentName" : "Dubo Graham-Douglas",

        "phone" : "+447875285354",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-14T21:48:59.831Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-14T21:49:05.811Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-14T21:49:09.379Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce866401e89846655a1a8c"),

        "createdAt" : ISODate("2015-08-15T00:23:00.357Z"),

        "updatedAt" : ISODate("2015-08-15T05:50:15.287Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "swati shetty",

        "email" : "swati.shetty74@gmail.com",

        "phone" : "+44 7831789929",

        "residentName" : "alisha sachdev",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-15T05:49:52.988Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-15T05:50:01.802Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-15T05:50:15.286Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55ce90cb01e89846655a1a91"),

        "createdAt" : ISODate("2015-08-15T01:07:23.686Z"),

        "updatedAt" : ISODate("2015-08-15T05:50:12.890Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Ann Glackin",

        "email" : "glack22a@mtholyoke.edu",

        "phone" : "+15713290098",

        "residentName" : "Stephen Kime",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-15T05:49:49.784Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-15T05:50:03.900Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-15T05:50:12.889Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cea26a01e89846655a1a95"),

        "createdAt" : ISODate("2015-08-15T02:22:34.343Z"),

        "updatedAt" : ISODate("2015-08-15T05:50:09.992Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "james hunter",

        "email" : "james-hunter-1@hotmail.co.uk",

        "phone" : "+447590438565",

        "residentName" : "Madison Davenport",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-15T05:49:44.775Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-15T05:50:06.727Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-15T05:50:09.991Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cf76d801e89846655a1abe"),

        "createdAt" : ISODate("2015-08-15T17:28:56.996Z"),

        "updatedAt" : ISODate("2015-08-15T19:13:30.611Z"),

        "location" : "Notting Hill",

        "type" : "Family",

        "name" : "Celine Lanting",

        "email" : "celine.lanting@gmail.com",

        "phone" : "+31683267349",

        "residentName" : "Yvette Lanting",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-15T17:37:12.587Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-15T18:57:26.636Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-15T19:13:30.610Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cf8def01e89846655a1ac8"),

        "createdAt" : ISODate("2015-08-15T19:07:27.941Z"),

        "updatedAt" : ISODate("2015-08-15T19:26:41.619Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "James Hunter",

        "email" : "james-hunter-1@hotmail.co.uk",

        "phone" : "+447590438565",

        "residentName" : "Madison Davenport",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-15T19:13:37.874Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-15T19:26:38.534Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-15T19:26:41.618Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cfc5cd01e89846655a1af6"),

        "createdAt" : ISODate("2015-08-15T23:05:49.893Z"),

        "updatedAt" : ISODate("2015-08-16T02:38:47.430Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Mehdi Benhalima",

        "email" : "mehdibe@kth.se",

        "phone" : "+4672124298",

        "residentName" : "Fatine Abdoussi",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-16T02:25:05.868Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b370f"),

        "checkedOutAt" : ISODate("2015-08-16T02:38:44.098Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-16T02:38:47.429Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55cff1a401e89846655a1b03"),

        "createdAt" : ISODate("2015-08-16T02:12:52.081Z"),

        "updatedAt" : ISODate("2015-08-16T02:38:55.987Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Ilaria Supino",

        "email" : "supino.ilaria@gmail.com",

        "phone" : "+393486575748",

        "residentName" : "Marcello Zompi",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedInAt" : ISODate("2015-08-16T02:25:07.005Z"),

        "checkedInBy" : ObjectId("555d8f2071320040670b370f"),

        "checkedOutAt" : ISODate("2015-08-16T02:38:52.120Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-16T02:38:55.986Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55d0710001e89846655a1b11"),

        "createdAt" : ISODate("2015-08-16T11:16:16.358Z"),

        "updatedAt" : ISODate("2015-08-16T19:02:08.203Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "Sodein Graham-Douglas",

        "email" : "sodeinfierce@yahoo.com",

        "phone" : "+447875285354",

        "residentName" : "Dubo Graham-Douglas",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-16T11:30:52.810Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-16T19:02:01.540Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-16T19:02:08.202Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    },

    {

        "_id" : ObjectId("55d0c40201e89846655a1b39"),

        "createdAt" : ISODate("2015-08-16T17:10:26.764Z"),

        "updatedAt" : ISODate("2015-08-16T19:02:05.772Z"),

        "location" : "Notting Hill",

        "type" : "Student",

        "name" : "anisha muller",

        "email" : "anishamuller@gmail.com",

        "phone" : "+4474815779842",

        "residentName" : "anca rujan",

        "checkedOut" : true,

        "checkedIn" : true,

        "deleted" : true,

        "plus18" : true,

        "sendPromotions" : true,

        "selfCheckIn" : false,

        "__v" : 0,

        "checkedInAt" : ISODate("2015-08-16T17:32:04.435Z"),

        "checkedInBy" : ObjectId("555d947480d6d31c68b22f17"),

        "updatedBy" : ObjectId("555d8f2071320040670b3716"),

        "checkedOutAt" : ISODate("2015-08-16T19:02:03.083Z"),

        "checkedOutBy" : ObjectId("555d8f2071320040670b3716"),

        "deletedAt" : ISODate("2015-08-16T19:02:05.770Z"),

        "deletedBy" : ObjectId("555d8f2071320040670b3716")

    }];
var xls = json2xls(data);

fs.writeFileSync('deletedRecords-7-Aug-to-17Aug.xlsx', xls, 'binary');

json2csv({ data: data, fields: fields }, function(err, csv) {
    fs.writeFile('deletedRecords-7-Aug-to-17Aug.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
});
//data.forEach(function(d){
//    console.log(d._id, d.createdAt, d.updatedAt, d.location, d.type, d.name, d.email, d.phone, d.residentName, d.checkedOut, d.checkedIn, d.deleted, d.plus18, d.sendPromotions, d.selfCheckIn, d.updatedBy, d.checkedInAt,d.checkedInBy,d.checkedOutAt, d.checkedOutBy,d.deletedAt,d.deletedBy);
//})
