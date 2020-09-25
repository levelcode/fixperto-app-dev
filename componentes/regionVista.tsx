import React, { Component } from "react";
import { View, Dimensions, Text } from 'react-native';
import { Button } from 'react-native-elements';
import MultiSelect from 'react-native-multiple-select';
import { TabView, TabBar } from 'react-native-tab-view';
import Ciudad from "./ciudadVista";
const initialLayout = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height
};
import AlertModal from "./alertView";
import { url } from "./config";
export default class RegionVista extends Component {
	constructor(props) {
		super(props);
		this.state = { textoAlert: "", showAlert: false, selectedItems: [], tabSelections: [], index: 0, selectedRegions: [], routes: [], seleccionadas: {} }
	}
	multiSelect = null;
	renderScene = ({ route }) => {
		return <Ciudad city={route.title} coordinate={route.coordinate} regionsSelected={this.selectedRegions} regions={route.regions} seleccionadas={this.state["seleccionadas"][route.key]} height={(this.props["navigation"].getParam("single")) ? Dimensions.get('window').height - 200 : Dimensions.get('window').height - 295} single={(this.props["navigation"].getParam("single")) ? true : false} />;
	};
	componentDidMount() {
		if (this.state["routes"].length === 0)
			return fetch(url + 'seguridad/getRegions', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth }
			}).then(response => response.json()).then(responseJson => { this.setState({ routes: responseJson.regions }); })
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
	}
	onSelectedItemsChange = selectedItems => {
		if (selectedItems) {
			let tabSelections = [];
			selectedItems.forEach(item => {
				const tab = this.state["routes"].find(route => route.key === item);
				tabSelections.push(tab);
			});
			if (!this.props["navigation"].getParam("single"))
				this.props["selected"]((selectedItems.length > 0) ? true : false);
			this.setState({ selectedItems, tabSelections });
		}
	};
	selectedRegions = (action, region) => {
		if (action === "select") {
			if (this.props["ruta"])
				this.setState(prevState => ({ selectedRegions: [...prevState["selectedRegions"].concat(region["id"])] }));
			else {
				this.setState(prevState => ({ selectedRegions: [region] }));
			}
		}
		else {
			var selectedRegions = Object.assign([], this.state["selectedRegions"]);
			var i = (!this.props["navigation"].getParam("single")) ? selectedRegions.findIndex(reg => reg === region) : selectedRegions.findIndex(reg => reg["id"] === region);
			selectedRegions.splice(i, 1);
			this.setState({ selectedRegions });
		}
	}
	saveRegion() {
		if (this.state["selectedRegions"].length > 0) {
			if (this.props["ruta"]) {
				let informacion = this.props["navigation"].getParam("informacion");
				informacion["regions"] = this.state["selectedRegions"];
				this.props["navigation"].navigate(this.props["ruta"], { informacion, type: this.props["type"] });
			} else {
				this.props["navigation"].navigate(this.props["navigation"].getParam("ruta"), {
					regions: this.state["selectedRegions"]
				})
			}
		}
	}
	renderTabBar = props => (
		<TabBar {...props} indicatorStyle={{ backgroundColor: '#42AECB' }}
			style={{ backgroundColor: '#F8F8F8' }}
			renderLabel={({ route, focused, color }) => (<Text style={{ color: "black" }}>{route.title}</Text>)}
		/>);
	render() {
		let { index } = this.state;
		let routes = this.state["tabSelections"];
		let enabled = (this.state["selectedRegions"].length > 0) ? false : true;
		const single = (this.props["navigation"].getParam("single")) ? true : false;
		return (
			<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<View style={{ marginHorizontal: 20, marginTop: 5 }}>
					<MultiSelect
						hideTags hideDropdown single={single}
						items={this.state["routes"]}
						uniqueKey="key"
						displayKey="title"
						ref={(component) => { this.multiSelect = component }}
						onSelectedItemsChange={this.onSelectedItemsChange}
						selectedItems={this.state["selectedItems"]}
						selectText="Ciudades"
						searchInputPlaceholderText="Buscar..."
						tagTextColor="#CCC"
						tagRemoveIconColor="red"
						tagBorderColor="silver"
						selectedItemTextColor="#CCC"
						selectedItemIconColor="#42AECB"
						itemTextColor="#000"
						submitButtonText="Confirmar selección"
						submitButtonColor="#43AECC"
					/>
				</View>

				<TabView
					renderTabBar={this.renderTabBar}
					navigationState={{ index, routes }}
					renderScene={this.renderScene}
					onIndexChange={(index) => this.setState({ index })}
					initialLayout={{ width: initialLayout.width, height: (single === true) ? (initialLayout.height - 200) : (initialLayout.height - 295) }}
				/>

				<Button title="GUARDAR" disabled={enabled} buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
					titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginTop: 5, marginBottom: 20 }}
					onPress={() => { this.saveRegion() }} />
			</View>
		)
	}
}
