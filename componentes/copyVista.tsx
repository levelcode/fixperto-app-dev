import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CopyVista({ texto }) {
	return (
		<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, marginTop: 10, backgroundColor: "#ECF7F9", borderRadius: 5, paddingVertical: 5, }}>

			<View style={{ flex: 0.20, borderRadius: 5, alignItems: "center", marginVertical: 5 }}>
				<Ionicons name="ios-alert" size={35} color="#47AAC9" />
			</View>

			<View style={{ flex: 0.80 }}>
				<Text style={{ color: "#47AAC9", marginEnd: 5, marginLeft: 5, fontFamily: "Raleway-Regular", }}>{texto}</Text>
			</View>

		</View>
	)
}