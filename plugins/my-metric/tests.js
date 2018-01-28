var request = require('supertest');
var should = require('should');
var testUtils = require("../../test/testUtils");
request = request(testUtils.url);

var APP_KEY = "";
var API_KEY_ADMIN = "";
var APP_ID = "";
var DEVICE_ID = "1234567890";
var COMMENT_ID = "";
var CRASHES = [];
var CRASH_URL = "";
var RE = /^-{0,1}\d*\.{0,1}\d+$/;

describe('Testing My Metric', function(){
//{"users":{"total":0,"affected":0,"fatal":0,"nonfatal":0},"crashes":{"total":0,"unique":0,"resolved":0,"unresolved":0,"fatal":0,"nonfatal":0,"news":0,"renewed":0,"os":{},"highest_app":""},"loss":0,"groups":[],"data":{}}
    
	describe('Empty crashes', function(){
		it('should have no crashes', function(done){
			API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
			APP_ID = testUtils.get("APP_ID");
			APP_KEY = testUtils.get("APP_KEY");
			request
			.get('/o?method=crashes&api_key='+API_KEY_ADMIN+"&app_id="+APP_ID+"&graph=1")
			.expect(200)
			.end(function(err, res){
				if (err) return done(err);
				var ob = JSON.parse(res.text);
                ob.should.have.property("users", {"total":0,"affected":0,"fatal":0,"nonfatal":0});
                ob.should.have.property("crashes", {"total":0,"unique":0,"resolved":0,"unresolved":0,"fatal":0,"nonfatal":0,"news":0,"renewed":0,"os":{},"highest_app":""});
                ob.should.have.property("loss", 0);
                ob.should.have.property("data", {});
				setTimeout(done, 1000);
			});
		});
	});
    
    describe('Create user', function(){
		it('should success', function(done){
			request
			.get('/i?device_id='+DEVICE_ID+'1&app_key='+APP_KEY+"&begin_session=1")
			.expect(200)
			.end(function(err, res){
				if (err) return done(err);
				var ob = JSON.parse(res.text);
				ob.should.have.property('result','Success');
				setTimeout(done, 3000);
			});
		});
	});
    
    describe('Add crash', function(){
		it('should success', function(done){
			var crash = {};
            crash._os = "Android";
            crash._os_version = "4.0";
            crash._device = "Galaxy S3";
            crash._manufacture = "Samsung";
            crash._resolution = "480x800";
            crash._app_version = "1.1";
            crash._cpu = "armv7";
            crash._opengl = "openGL ES 2.0";
            
            crash._ram_total = 2*1024;
			crash._ram_current = 1024;
			crash._disk_total = 10*1024;
			crash._disk_current = 2*1024;
			crash._bat_total = 100;
			crash._bat_current = 40;
			crash._orientation = "landscape";
            
			crash._root = true;
			crash._online = false;
			crash._signal = true;
			crash._muted = false;
			crash._background = true;
            
			crash._error = "java.lang.NullPointerException: com.domain.app.Exception<init>\nat com.domain.app.<init>(Activity.java:32)\nat com.domain.app.<init>(Activity.java:24)\nat com.domain.app.<init>(Activity.java:12)";
            crash._nonfatal = true;
            crash._run = 60;
            
            crash._custom = {
                "facebook" : "3.0",
                "googleplay" : "1.0"
            };
			request
			.get('/i?device_id='+DEVICE_ID+'1&app_key='+APP_KEY+"&crash="+JSON.stringify(crash))
			.expect(200)
			.end(function(err, res){
				if (err) return done(err);
				var ob = JSON.parse(res.text);
				ob.should.have.property('result','Success');
				setTimeout(done, 3000);
			});
		});
	});
    
    describe('Check crash metrics', function(){
		it('should have 1 crash', function(done){
			request
			.get('/o?method=crashes&api_key='+API_KEY_ADMIN+"&app_id="+APP_ID+"&graph=1")
			.expect(200)
			.end(function(err, res){
				if (err) return done(err);
				var ob = JSON.parse(res.text);
                ob.should.have.property("users", {"total":1,"affected":1,"fatal":0,"nonfatal":1});
                ob.should.have.property("crashes", {"total":1,"unique":1,"resolved":0,"unresolved":1,"fatal":0,"nonfatal":1,"news":1,"renewed":0,"os":{"Android":1},"highest_app":"1.1"});
                ob.should.have.property("loss", 0);
                ob.should.have.property("data");
                verifyMetrics(ob.data, {meta:{}, cr: 1, crnf: 1, cru: 1});
				setTimeout(done, 1000);
			});
		});
	});
    
    describe('Check crash data', function(){
		it('should have 1 crash', function(done){
			request
			.get('/o?method=crashes&api_key='+API_KEY_ADMIN+"&app_id="+APP_ID)
			.expect(200)
			.end(function(err, res){
				if (err) return done(err);
				var ob = JSON.parse(res.text);
                ob.should.have.property("iTotalRecords", 1);
                ob.should.have.property("iTotalDisplayRecords", 1);
                var crash = ob.aaData[0];
                crash.should.have.property("_id");
                crash.should.have.property("error", "java.lang.NullPointerException: com.domain.app.Exception&lt;init&gt;\nat com.domain.app.&lt;init&gt;(Activity.java:32)\nat com.domain.app.&lt;init&gt;(Activity.java:24)\nat com.domain.app.&lt;init&gt;(Activity.java:12)");
                crash.should.have.property("is_new", true);
                crash.should.have.property("is_resolved", false);
                crash.should.have.property("lastTs");
                crash.should.have.property("latest_version", "1.1");
                crash.should.have.property("name", "java.lang.NullPointerException: com.domain.app.Exception&lt;init&gt;");
                crash.should.have.property("nonfatal", true);
                crash.should.have.property("os", 'Android');
                crash.should.have.property("reports", 1);
                crash.should.have.property("users", 1);
                CRASHES[0] = crash._id;
				setTimeout(done, 1000);
			});
		});
	});
    
        //Simple api test
    describe('Empty plugin', function(){
        it('should have no data', function(done){
        
        //on first test we can retrieve settings
                API_KEY_ADMIN = testUtils.get("API_KEY_ADMIN");
                APP_ID = testUtils.get("APP_ID");
                APP_KEY = testUtils.get("APP_KEY");
        
        //and make a request
                request
                .get('/o?api_key='+API_KEY_ADMIN+'&app_id='+APP_ID+'&method=ourplugin')
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    var ob = JSON.parse(res.text);
                    ob.should.be.empty;
                    done();
                });
            });
    });
    
    //Testing frontend
    describe('Posting data to front end', function(){
        //first we authenticate
            before(function( done ){
                testUtils.login( request );
                testUtils.waitLogin( done );
            });
            it('should have no live data', function(done){
                request
                .post("/events/iap")
                .send({
            app_id:APP_ID, 
            somedata:"data", 
            //getting csrf
            _csrf:testUtils.getCSRF()})
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    done();
                });
            });
        });
    
    //Reset app data
    describe('reset app', function(){
            it('should reset data', function(done){
                var params = {app_id:APP_ID};
                request
                .get('/i/apps/reset?api_key='+API_KEY_ADMIN+"&args="+JSON.stringify(params))
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    var ob = JSON.parse(res.text);
                    ob.should.have.property('result', 'Success');
            //lets wait some time for data to be cleared
                    setTimeout(done, 5000)
                });
            });
        });
    
    //after that we can also test to verify if data was cleared
    describe('Verify empty plugin', function(){
        it('should have no data', function(done){
                request
                .get('/o?api_key='+API_KEY_ADMIN+'&app_id='+APP_ID+'&method=ourplugin')
                .expect(200)
                .end(function(err, res){
                    if (err) return done(err);
                    var ob = JSON.parse(res.text);
                    ob.should.be.empty;
                    done();
                });
            });
    });
    
    describe('Create user', function(){
		it('should success', function(done){
			request
			.get('/i?device_id='+DEVICE_ID+'2&app_key='+APP_KEY+"&begin_session=1")
			.expect(200)
			.end(function(err, res){
				if (err) return done(err);
				var ob = JSON.parse(res.text);
				ob.should.have.property('result','Success');
				setTimeout(done, 3000);
			});
		});
	});
   
});