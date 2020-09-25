import React, { Component } from 'react';
import { View, ScrollView, Dimensions, AsyncStorage, Text } from 'react-native';
import { Button } from 'react-native-elements';
import MultiSelect from 'react-native-multiple-select';
import { TabView, TabBar } from 'react-native-tab-view';
import { NavigationEvents } from 'react-navigation';
import Ciudad from "../../../componentes/ciudadVista";
import AlertModal from "../../../componentes/alertView";
import { buttons } from "../../../style/style";
import { url } from "../../../componentes/config";
const initialLayout = {
	width: Dimensions.get('window').width,
	height: Dimensions.get('window').height - 295
};
export default class CoberturaEmpresaVista extends Component {
	multiSelect = null;
	constructor(props) {
		super(props);
		this.state = { textoAlert: "", showAlert: false, selectedItems: [], tabSelections: [], index: 0, selectedRegions: [], routes: [], seleccionadas: {}, selected: true }
	}
	renderScene = ({ route }) => {
		return <Ciudad city={route.title} coordinate={route.coordinate} regionsSelected={this.selectedRegions} regions={route.regions} seleccionadas={this.state["seleccionadas"][route.key]} height={Dimensions.get('window').height - 295} single={(this.props["navigation"].getParam("single")) ? true : false} />;
	};
	getCobertura = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'fixpertoEmpresa/getCobertura', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["typeId"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					this.setState({ seleccionadas: responseJson["regiones"], selectedRegions: responseJson["selectedRegions"] });
					this.onSelectedItemsChange(responseJson["ciudades"]);
				}
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	getRegiones = () => {
		if (this.state["routes"].length === 0) {
			return fetch(url + 'seguridad/getRegions', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth }
			}).then(response => response.json()).then(responseJson => {
				this.setState({ routes: responseJson.regions }); this.getCobertura();
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		}
		else { this.getCobertura(); }
	}
	onSelectedItemsChange = selectedItems => {
		if (selectedItems) {
			let tabSelections = [];
			selectedItems.forEach(item => {
				const tab = this.state["routes"].find(route => route.key === item);
				tabSelections.push(tab);
			});
			this.setState({ selected: (selectedItems.length > 0) ? true : false });
			this.setState({ selectedItems, tabSelections });
		}
	};
	selectedRegions = (action, region) => {
		if (action === "select") {
			this.setState(prevState => ({ selectedRegions: [...prevState["selectedRegions"].concat({ id: region["id"] })] }));
		}
		else {
			var i = this.state["selectedRegions"].findIndex(reg => reg === region);
			let selectedRegions = this.state["selectedRegions"];
			selectedRegions.splice(i, 1);
		}
	}
	saveRegion() {
		if (this.state["selectedRegions"].length > 0) {
			AsyncStorage.getItem("@USER").then((user) => {
				user = JSON.parse(user);
				return fetch(url + 'fixpertoEmpresa/modCobertura', {
					method: "POST",
					headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
					body: JSON.stringify({ id: user["typeId"], regions: this.state["selectedRegions"] })
				}).then(response => response.json()).then(responseJson => {
					if (responseJson.success) { this.props["navigation"].goBack(); }
				})
					.catch((error) => {
						if (error.message === 'Timeout' || error.message === 'Network request failed') {
							this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
						}
					})
			})
		}
		else { this.setState({ showAlert: true, textoAlert: "Debe seleccionar al menos una región" }); }
	}
	renderTabBar = props => (
		<TabBar {...props} indicatorStyle={{ backgroundColor: '#42AECB' }}
			style={{ backgroundColor: '#F8F8F8' }}
			renderLabel={({ route, focused, color }) => (<Text style={{ color: "black" }}>{route.title}</Text>)}
		/>);
	render() {
		let { index } = this.state;
		let routes = this.state["tabSelections"];
		return (
			<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<NavigationEvents onDidFocus={payload => this.getRegiones()} />
				<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
					<View style={{ marginHorizontal: 20, marginTop: 5 }}>
						<MultiSelect
							hideDropdown hideTags
							items={this.state["routes"]}
							uniqueKey="key"
							displayKey="title"
							ref={(component) => { this.multiSelect = component }}
							onSelectedItemsChange={this.onSelectedItemsChange}
							selectedItems={this.state["selectedItems"]}
							selectText="Ciudad"
							tagTextColor="#CCC"
							tagRemoveIconColor="red"
							tagBorderColor="silver"
							selectedItemTextColor="#CCC"
							selectedItemIconColor="#42AECB"
							itemTextColor="#000"
							searchInputStyle={{ color: 'black', fontFamily: "Raleway-Regular" }}
							submitButtonText="Confirmar selección"
							submitButtonColor="#43AECC"
						/>
					</View>
					<TabView
						renderTabBar={this.renderTabBar}
						navigationState={{ index, routes }}
						renderScene={this.renderScene}
						onIndexChange={(index) => this.setState({ index })}
						initialLayout={initialLayout}
					/>
				</View>
				<Button title="GUARDAR" buttonStyle={[buttons.primary, buttons.mtop]}
					disabled={this.state["buttonDisabled"]}
					titleStyle={buttons.PrimaryText} containerStyle={{}}
					onPress={() => this.saveRegion()} />
			</ScrollView>
		)
	}
}
