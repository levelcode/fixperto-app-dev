import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { Polygon, Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
const { width, height } = Dimensions.get("window");

class Polygono extends Component {
	constructor(props) {
		super(props); this.state = {
			fillColor: (this.props["seleccionadas"].findIndex(ci => { return ci === this.props["datos"]["id"] }) !== -1) ? " rgba(66, 174, 203, .2)" : "transparent",
			selected: (this.props["seleccionadas"].findIndex(ci => { return ci === this.props["datos"]["id"] }) !== -1) ? true : false,
		}
	}
	referencia = null;
	static getDerivedStateFromProps(props, state) {
		var fillColor = (props["seleccionadas"].findIndex(ci => { return ci === props["datos"]["id"] }) !== -1) ? " rgba(66, 174, 203, .2)" : "transparent";
		var selected = (props["seleccionadas"].findIndex(ci => { return ci === props["datos"]["id"] }) !== -1) ? true : false;
		return { fillColor, selected };
	}
	press = () => {
		this.referencia.showCallout();
		if (this.state["selected"]) {
			this.setState({ selected: false, fillColor: "transparent" });
			this.props["on_press"](this.props["datos"]["id"], false);
			this.props["selectedRegions"]("deselect", this.props["datos"]["id"]);
		}
		else {
			this.setState({ selected: true, fillColor: " rgba(66, 174, 203, .2)" });
			this.props["on_press"](this.props["datos"]["id"], true);
			this.props["selectedRegions"]("select", { id: this.props["datos"]["id"], name: this.props["datos"]["name"], description: this.props["datos"]["description"] });
		}
	}
	render() {
		return (
			<View>
				<Polygon
					coordinates={this.props["datos"]["coordinates"]}
					strokeColor="#42AECB"
					fillColor={this.state["fillColor"]}
					tappable={true}
					onPress={() => { this.press() }}
				>
				</Polygon>
				<Marker onPress={() => this.press()} pinColor="#42AECB" opacity={0.9} title={this.props["datos"]["name"].split(" / ")[1]}
					ref={ref => { this.referencia = ref; }}
					coordinate={{
						latitude: this.props["datos"]["coordinates"].reduce(function (total, currentValue) {
							return total + currentValue["latitude"];
						}, 0) / this.props["datos"]["coordinates"].length,
						longitude: this.props["datos"]["coordinates"].reduce(function (total, currentValue) {
							return total + currentValue["longitude"];
						}, 0) / this.props["datos"]["coordinates"].length
					}} tracksViewChanges={false}>

				</Marker>
			</View>
		)
	}
}
export default class RegionesVista extends Component {
	constructor(props) { super(props); this.state = { seleccionadas: this.props["seleccionadas"] } }
	on_press = (id, status) => {
		if (this.props["single"]) { var seleccionadas = (status) ? [id] : []; this.setState({ seleccionadas }); }
		else {
			if (status) { this.setState(prevState => ({ seleccionadas: [...prevState["seleccionadas"].concat(id)] })); }
			else {
				var i = this.state["seleccionadas"].findIndex(ids => ids === id);
				let seleccionadas = this.state["seleccionadas"];
				seleccionadas.splice(i, 1);
			}
		}
	}
	render() {
		const { coordinate, regions, selectedRegions, altura, single } = this.props;

		return (
			<View style={styles.container} >
				<MapView style={{ width: width - 10, height: altura }}
					initialRegion={{
						latitude: coordinate.latitude, longitude: coordinate.longitude,
						latitudeDelta: 0.5, longitudeDelta: 0.5 * (width / height),
					}}
					customMapStyle={
						[
							{
								"elementType": "geometry",
								"stylers": [
									{
										"color": "#f5f5f5"
									}
								]
							},
							{
								"elementType": "labels.icon",
								"stylers": [
									{
										"visibility": "off"
									}
								]
							},
							{
								"elementType": "labels.text.fill",
								"stylers": [
									{
										"color": "#616161"
									}
								]
							},
							{
								"featureType": "road",
								"elementType": "geometry",
								"stylers": [
									{
										"color": "#ffffff"
									}
								]
							},
							{
								"featureType": "road.arterial",
								"elementType": "labels.text.fill",
								"stylers": [
									{
										"color": "#757575"
									}
								]
							},
							{
								"featureType": "road.highway",
								"elementType": "geometry",
								"stylers": [
									{
										"color": "#dadada"
									}
								]
							}
						]
					}
				>
					{regions.map((region, id) => {
						return <Polygono datos={region} key={id} selectedRegions={selectedRegions} seleccionadas={this.state["seleccionadas"]} single={single} on_press={this.on_press} />
					})}
				</MapView>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
	plainView: {},
});