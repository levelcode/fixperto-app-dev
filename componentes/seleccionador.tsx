import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Button, Divider, CheckBox, Input } from 'react-native-elements';
import Modal from "react-native-modal";
import { Ionicons } from '@expo/vector-icons';
import { MultipleSelectPicker } from 'react-native-multi-select-picker';
class Elemento extends Component {
	constructor(props) { super(props); this.state = { isShownPicker: false }; }
	render() {
		return (
			<View key={this.props["index"]} >
				<Divider />
				<TouchableOpacity
					onPress={() => { this.setState({ isShownPicker: !this.state["isShownPicker"] }); }}
					style={{ flexDirection: "row-reverse", padding: 10, height: 50, alignItems: 'center', backgroundColor: '#dadde3' }}>
					<Ionicons name={(!this.state["isShownPicker"]) ? "ios-arrow-forward" : "ios-arrow-down"} size={20} style={{ marginHorizontal: 10 }} />
					<Text style={{ fontSize: 15, textAlign: "left", flex: 1, marginHorizontal: 10 }}>{this.props["item"]["grouped"]}</Text>
				</TouchableOpacity>
				{this.state["isShownPicker"] ? <MultipleSelectPicker
					items={this.props["item"]["elementos"]}
					onSelectionsChange={(ele) => { this.props["select"](ele); }}
					selectedItems={this.props["selectedItems"]}
					buttonStyle={{ height: 100, justifyContent: 'center', alignItems: 'center' }}
					checkboxStyle={{ height: 20, width: 20 }}
				/> : null}
			</View >
		)
	}
}
export default class SeleccionadorVista extends Component {
	constructor(props) { super(props); this.state = { isModalVisible: false, selectedItems: [], items: [], showSugerir: false }; }
	selectCategories = (selectedItems) => { this.props["confirm"](selectedItems); };
	confirmar = () => { this.setState({ isModalVisible: false }); };
	remove = (it, i) => {
		let selectedItems = this.props["selectedItems"]; selectedItems.splice(i, 1);
		if (it["value"] === "0key") { this.props["cp"](""); } this.props["confirm"](selectedItems);
	}
	deselectNoExiste = () => {
		let selectedItems = this.props["selectedItems"];
		var i = selectedItems.indexOf({ label: "Mi categoría no existe", value: "0key" });
		selectedItems.splice(i, 1);
		this.props["confirm"](selectedItems);
	}
	render() {
		return (
			<View>
				<TouchableOpacity onPress={() => { this.setState({ isModalVisible: true }) }}
					style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#dadde3', borderRadius: 5 }}>
					<Text>{(this.props["texto"]) ? this.props["texto"] : "Seleccione..."}</Text>
				</TouchableOpacity>
				<View>
					{(this.props["selectedItems"] || []).map((item: any, index) => {
						return <View key={index} style={{ flexDirection: "row", height: 50, alignItems: 'center', borderWidth: 0.5, borderColor: "silver" }}						>
							<Text style={{ marginHorizontal: 10 }}>{item.label} <Ionicons name="ios-close-circle" color="#CE4343" size={30} style={{ marginHorizontal: 10 }} onPress={() => { this.remove(item, index) }} /> </Text>
						</View>
					})}
					{this.props["category_proposal"] !== "" && <View style={{ marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Categorías sugeridas</Text>
						<Input
							multiline disabled
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
							inputContainerStyle={{ borderBottomWidth: 0, }}
							value={this.props["category_proposal"]}
						/>
					</View>}
				</View>
				<Modal isVisible={this.state["isModalVisible"]} style={{ margin: 5, padding: 0 }}>
					<View style={{ flex: 1, marginHorizontal: 10, marginVertical: 10, backgroundColor: "#FFFFFF" }}>
						<ScrollView>
							{(this.props["items"] || []).map((item: any, index) => {
								return <Elemento key={index} item={item} selectedItems={this.props["selectedItems"]} select={this.selectCategories} />
							})
							}
							<View style={{ backgroundColor: "#dadde3" }}>
								<Divider />
								<CheckBox containerStyle={{ backgroundColor: "#dadde3", borderWidth: 0, marginLeft: 12 }}
									title={<Text style={{ fontSize: 14, }}>Mi categoría no existe</Text>}
									checked={this.state["showSugerir"]} checkedColor="#3D99B9"
									onPress={() => {
										if (this.state["showSugerir"] === true) {
											this.setState({ showSugerir: false }); this.props["cp"](""); this.deselectNoExiste();
										} else { this.setState({ showSugerir: true }); this.props["add_cp"]({ label: "Mi categoría no existe", value: "0key" }); }
									}
									}
								/>
								{this.state["showSugerir"] && <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
									<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Agrega los servicios que no aparecen en la lista</Text>
									<Input
										multiline
										autoFocus={true}
										inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
										inputContainerStyle={{ borderBottomWidth: 0, }}
										value={this.props["category_proposal"]} onChangeText={(category_proposal) => this.props["cp"](category_proposal)}
									/>
								</View>}
							</View >
						</ScrollView >
						<Button title="CONFIRMAR"
							buttonStyle={{ backgroundColor: "#42AECB" }}
							type="solid" containerStyle={{}} onPress={() => this.confirmar()}
						/>
					</View>
				</Modal>
			</View>
		)
	}
}