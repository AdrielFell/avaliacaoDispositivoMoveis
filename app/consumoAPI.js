import { SafeAreaView } from "react-native-safe-area-context";
import { Button, StyleSheet, Text, TextInput, Image } from "react-native";
import { useState, useEffect } from "react";

async function getCep(cep){
    const resposta = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    if (resposta.ok) {
        const payload = await resposta.json();
        return payload;
    }
    return null;
}

export default function cep() {
    const [cep, setCep] = useState('');
    const [cepState, setCepState] = useState('');
    const [cepPesquisar, setCepPesquisar] = useState('');

    async function carregarCep(){
        const cp = await getCep(cepPesquisar);
        setCep(cp.city || 'Cidade do cep não encontrado');
        setCepState(cp.state || 'Estado do CEP não encontrado');
    }

    // useEffect(() => {
    //     carregarcep();
    //   }, []);

    return (
        <SafeAreaView style={estilos.container}>
            <TextInput
                value={cepPesquisar}
                onChangeText={setCepPesquisar}
            />
            <Button title="Pesquisar" onPress={carregarCep}/>
            <Text>Cidade: {cep}</Text>
            <Text>Estado: {cepState}</Text>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1
    }
});