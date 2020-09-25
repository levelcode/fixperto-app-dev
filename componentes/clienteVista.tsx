import React from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { url } from "./config";
export default function ClienteVista({ cliente, navigation }) {
	return (
		<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 5 }} onPress={() => { navigation.navigate("DatosCliente", { customer: (cliente["type"]) ? cliente["typeId"] : cliente["id"] }) }}>
			<View style={{ flex: 0.3, borderRadius: 5, alignItems: "center" }}>
				<Image
					style={{ width: 80, height: 80, borderRadius: 10 }}
					source={{ uri: url + "uploads/registros/cliente/" + cliente["avatar"] }}>
				</Image>
			</View>
			<View style={{ marginBottom: 5, flex: 0.7, flexDirection: "row" }}>
				<Text style={{ flex: 0.8, fontFamily: "Raleway-Bold", fontSize: 17 }}>{cliente.name}</Text>
				<View style={{ flex: 0.3 }}>
					{
						(cliente.evaluation) ?
							<Text style={[{ marginHorizontal: 0 }]}>
								<Ionicons name="ios-star" size={15} color="#FFCE07" />
								{cliente.evaluation}
							</Text>
							:
							<View>
								<Text></Text>
								<Text style={[{ marginHorizontal: 0, fontSize: 10 }]}>
									<Ionicons name="ios-star" size={15} color="#FFCE07" /> Sin
							</Text>
								<Text style={[{ marginHorizontal: 0, fontSize: 10 }]}>
									calificación
							</Text>
							</View>
					}
				</View>
			</View>
		</TouchableOpacity>
	)
}