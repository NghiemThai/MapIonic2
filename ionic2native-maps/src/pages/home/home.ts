import { Component, NgZone } from '@angular/core';
import { NavController, Platform, AlertController,  Events } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsMarkerOptions, GoogleMapsMarker, CameraPosition, GoogleMapsPolyline, GoogleMapsCircle } from 'ionic-native';
import { Geolocation, GoogleMapsPolygon  } from 'ionic-native';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Component({
    selector: 'home-page',
    templateUrl: 'home.html'
})
export class HomePage {
    private positions: Array<GoogleMapsLatLng>;       //複数のポジションを保持する変数の型を宣言
    private markers: Array<GoogleMapsMarker>;     //複数のマーカーを保持する変数の型を宣言
    private poly_lines: Array<GoogleMapsPolyline>;
    private poly_geo: Array<GoogleMapsPolygon >;
    map: GoogleMap;
    private circle: GoogleMapsCircle;
    posts: any;
    distance: any;
    timeToGo: any;
    coordinator: any;
    constructor(public navCtrl: NavController
        , public platform: Platform
        , public alertCtrl: AlertController
        , private _zone: NgZone
        , public http: Http, public events: Events) {
        this.timeToGo = "";
        this.distance = "";
        platform.ready().then(() => {
            this.loadMap();
        });
    }

    loadMap() {
        Geolocation.getCurrentPosition().then((resp) => {
            console.log("Latitude: ", resp.coords.latitude);
            console.log("Longitude: ", resp.coords.longitude);

            let location = new GoogleMapsLatLng(resp.coords.latitude, resp.coords.longitude);

            this.map = new GoogleMap('map', {
                'backgroundColor': 'white',
                'controls': {
                    'compass': true,
                    'myLocationButton': true,
                    'indoorPicker': true,
                    'zoom': true
                },
                'gestures': {
                    'scroll': true,
                    'tilt': true,
                    'rotate': true,
                    'zoom': true
                },
                'camera': {
                    'latLng': location,
                    'tilt': 30,
                    'zoom': 15,
                    'bearing': 50
                }
            });

            this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
                console.log('Map is ready!');
                this.events.subscribe('menu:opened', () => {
                    this.map.setClickable( false )
                });

                this.events.subscribe('menu:closed', () => {
                    this.map.setClickable( true )
                });

                this._zone.run(() => {
                    // this.http.get('https://maps.googleapis.com/maps/api/directions/json?origin=kuala%20lumpur&destination=Padang%20Tengku%20Malaysia&key=AIzaSyB1tc0mV8I2IEGQp1udHN6Q_Chh_VT32YM').map(res => res.json()).subscribe(data => {
                    //     this.posts = data.routes[0].overview_polyline.points;
                    //     console.log(this.posts);
                    //     this.coordinator = this.decodePolyline(data.routes[0].overview_polyline.points, 5);
                    //     this.timeToGo = data.routes[0].legs[0].duration.text;
                    //     this.distance = data.routes[0].legs[0].distance.text;
                    //     for (var i = 0; i < this.coordinator.length; i++) {
                    //         this.positions.push(new GoogleMapsLatLng(this.coordinator[i][0], this.coordinator[i][1]))
                    //     }
                    //     let customMarker = "www/assets/icon/Pink_icon.png";
                    //      this.map.addMarker({
                    //             position: this.positions[0],
                    //             title: 'des',
                    //             icon: customMarker
                    //         }).then((marker) => {
                    //             this.markers.push(marker);  //設置したマーカーを保持
                    //         });
                            
                    //         this.map.addMarker({
                    //             position: this.positions[this.positions.length-1],
                    //              title: 'des',
                    //             icon: customMarker
                    //         }).then((marker) => {
                    //             this.markers.push(marker);  //設置したマーカーを保持
                    //         });
                    //     // this.positions.forEach((position) => {
                    //     //     this.map.addMarker({
                    //     //         position: position
                    //     //     }).then((marker) => {
                    //     //         this.markers.push(marker);  //設置したマーカーを保持
                    //     //     });
                    //     // });
                    //     this.map.addPolyline({
                    //         points: this.positions,     //線の始点と終点
                    //         color: '#00A8E8',                                   //線の色
                    //         width: 5
                    //     }).then((poly_line) => {
                    //         this.poly_lines.push(poly_line);    //設置したラインを保持
                    //     });
                       
                    //     this.map.animateCamera({ target: new GoogleMapsLatLng(this.coordinator[0][0], this.coordinator[0][1]), zoom: 5 });
                    // });
                    this.map.animateCamera({ target: location, zoom: 5 });
                    let markerOptions: GoogleMapsMarkerOptions = {
                        position: location,
                        title: 'My Position'
                    };
                    this.map.addMarker(markerOptions)
                        .then((marker: GoogleMapsMarker) => {
                            console.log('marker ADDED'); // never fired
                            marker.showInfoWindow();
                            marker.addEventListener(GoogleMapsEvent.MARKER_DRAG_END).subscribe(
                                data => {
                                    marker.getPosition().then((lat: GoogleMapsLatLng) => {

                                        marker.setTitle(lat.lat + "");
                                        marker.showInfoWindow();
                                    });
                                });
                        }).catch((e) => { console.log(e); }); // never fired
                    // create LatLng object
                    // let ionic: GoogleMapsLatLng = new GoogleMapsLatLng(43.0741904, -89.3809802);

                    // create CameraPosition
                    // let position: CameraPosition = {
                    //     target: ionic,
                    //     zoom: 18,
                    //     tilt: 30
                    // };

                    // move the map's camera to position
                    // this.map.moveCamera(position);

                    // create new marker
                    // let markerOptions2: GoogleMapsMarkerOptions = {
                    //     position: ionic,
                    //     title: 'Ionic'
                    // };

                    // this.map.addMarker(markerOptions2)
                    //     .then((marker: GoogleMapsMarker) => {
                    //         marker.showInfoWindow();
                    //         marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(() => { console.log('Marker clicked...'); });
                    //     });
                     this.positions = [];
                    // this.positions = [
                    //         new GoogleMapsLatLng(34.669, 135.485),
                    //         new GoogleMapsLatLng(34.68, 135.488),
                    //         new GoogleMapsLatLng(34.69, 135.485),
                    //         new GoogleMapsLatLng(34.66, 135.481),
                    //     ];
                    this.markers = Array();     //マーカーを保持する配列を初期化
                    this.poly_lines = Array();  //ラインを保持する配列を初期化
                    this.poly_geo = Array();

                    let circle_position = new GoogleMapsLatLng(34.6687443, 135.4876302);
                    // this.map.addCircle({
                    //     center: ionic,    //円の中心座標を設定
                    //     radius: 100,                //円の半径を設定(m単位)
                    //     strokeColor: '#f53d3d',     //円の外周の線の色を設定
                    //     strokeWidth: 1,             //円の外周の線の太さを設定
                    //     fillColor: '#E6F7FF'        //円の内側の色を設定
                    // }).then((circle) => {
                    //     this.circle = circle;   //設置した円を保持
                    // });

                    let position2: CameraPosition = {
                        target: this.positions[0],
                        zoom: 18,
                        tilt: 30
                    };
                    this.map.moveCamera(position2);

                    // let HND_AIR_PORT = new GoogleMapsLatLng(35.548852,139.784086);
                    // let SFO_AIR_PORT = new GoogleMapsLatLng(37.615223,-122.389979);
                    // let HNL_AIR_PORT = new GoogleMapsLatLng(21.332898,-157.921418);
                    // this.positions.push(circle_position);
                    // this.positions.forEach((position) => {
                    //     this.map.addMarker({
                    //         position: position
                    //     }).then((marker) => {
                    //         this.markers.push(marker);  //設置したマーカーを保持
                    //     });
                    // });
                    //  this.map.addPolygon({
                    //             points: this.positions,     //線の始点と終点
                    //             strokeWidth: 2,
                    //             strokeColor: '#f53d3d'                              //線の色
                                
                    //     }).then((poly_geo) => {
                    //         this.poly_geo.push(poly_geo);    //設置したラインを保持
                    //     });
                    //ポジション間にラインを設置
                    // this.positions.forEach((position, index, positions) => {
                    //     this.map.addPolyline({
                    //             points: [positions[index], positions[index-1]],     //線の始点と終点
                    //             color: '#00A8E8',                                   //線の色
                    //             width: 1   
                    //     }).then((poly_line) => {
                    //         this.poly_lines.push(poly_line);    //設置したラインを保持
                    //     });
                    // });
                    // let myPosition = new GoogleMapsLatLng(38.9072, -77.0369);
                    // console.log("My position is", myPosition);
                    this.map.animateCamera({ target: this.positions[0], zoom: 10 });
                     this.map.on(GoogleMapsEvent.MAP_CLICK)
                        .subscribe((position3: GoogleMapsLatLng) => {
                            // let alert = this.alertCtrl.create({
                            // title: 'Distance and time from kuala lumpur to go Padang Tengku:',
                            // subTitle: 'Distance: ' + position3.lng + ", and Time: " + position3.lat,
                            //                     buttons: [{
                            //                         text: 'OK',
                            //                         handler: () => {
                            //                             this.map.setClickable(true);
                            //                         }
                            //     }]

                            // });
                            // alert.present();
                            // this.map.setClickable(false);
                            let markerOptionsClicked: GoogleMapsMarkerOptions = {
                                position: position3,
                                title: 'clicked point'
                            };
                            this.http.get('https://maps.googleapis.com/maps/api/directions/json?origin='+ location.lat + ","+ location.lng + 
                            '&destination='+ position3.lat + "," + position3.lng +'&key=AIzaSyB1tc0mV8I2IEGQp1udHN6Q_Chh_VT32YM').map(res => res.json()).subscribe(data => {
                                this.posts = data.routes[0].overview_polyline.points;
                                //console.log(this.posts);
                                this.positions = [];
                                this.positions.push(location);
                                this.coordinator = this.decodePolyline(data.routes[0].overview_polyline.points, 5);
                                this.timeToGo = data.routes[0].legs[0].duration.text;
                                this.distance = data.routes[0].legs[0].distance.text;
                                for (var i = 0; i < this.coordinator.length; i++) {
                                    this.positions.push(new GoogleMapsLatLng(this.coordinator[i][0], this.coordinator[i][1]))
                                }
                                this.positions.push(position3);
                                this.map.clear();
                                let customMarker = "www/assets/icon/Pink_icon.png";
                                this.map.addMarker({
                                        position: this.positions[0],
                                        title: 'origin',
                                        icon: customMarker
                                    }).then((marker) => {
                                        this.markers.push(marker);  //設置したマーカーを保持
                                    });
                                    
                                    this.map.addMarker({
                                        position: this.positions[this.positions.length-1],
                                        title: 'destination',
                                        icon: customMarker
                                    }).then((marker) => {
                                        this.markers.push(marker);  //設置したマーカーを保持
                                    });
                                // this.positions.forEach((position) => {
                                //     this.map.addMarker({
                                //         position: position
                                //     }).then((marker) => {
                                //         this.markers.push(marker);  //設置したマーカーを保持
                                //     });
                                // });
                                this.map.addPolyline({
                                    points: this.positions,     //線の始点と終点
                                    color: '#00A8E8',                                   //線の色
                                    width: 5
                                }).then((poly_line) => {
                                    this.poly_lines.push(poly_line);    //設置したラインを保持
                                });
                            
                               // this.map.animateCamera({ target: new GoogleMapsLatLng(this.coordinator[0][0], this.coordinator[0][1]), zoom: 15 });
                            });
                            this.map.addMarker(markerOptionsClicked)
                                .then((marker: GoogleMapsMarker) => {
                                    marker.showInfoWindow();
                                    marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(() => { console.log('Marker clicked...'); });
                                });
                                });
                });
            });
        });
        this.map.setClickable(true);

    }
    showAlert() {
        console.log('coordinator', this.coordinator[0]);
        let alert = this.alertCtrl.create({
            title: 'Distance and time from kuala lumpur to go Padang Tengku:',
            subTitle: 'Distance: ' + this.distance + ", and Time: " + this.timeToGo,
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.map.setClickable(true);
                }
            }]

        });
        alert.present();
        this.map.setClickable(false);
    }

    decodePolyline(str, precision) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);

        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {

            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            shift = result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            lat += latitude_change;
            lng += longitude_change;

            coordinates.push([lat / factor, lng / factor]);
        }

        return coordinates;
    };

}