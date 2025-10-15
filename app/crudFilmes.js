import { View, Text, Button, StyleSheet, FlatList, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, initDb } from "../data/db";

export default function Telafilmes() {
    const [id, setId,] = useState("");
    const [titulo, setTitulo] = useState("");
    const [genero, setGenero] = useState("");
    const [ano, setAno] = useState("");
    const [filmes, setFilmes] = useState([]);

    function getFilmes() {
        return db.getAllSync('SELECT * FROM filmes');
    }

    function getFilmeById(id) {
        const [filme] = db.getAllSync('SELECT * FROM filmes WHERE id = ?', [id]);
        return filme;
    }

    function killFilme() {
        return db.getAllSync('SELECT * FROM filmes');
    }

    function insertFilme(titulo, genero, ano) {
        db.runSync('INSERT INTO filmes (titulo, genero, ano) VALUES (?, ?, ?)', [titulo, genero, ano]);
    }

    function updateFilme(id, titulo, genero, ano) {
        db.runSync('UPDATE filmes SET titulo = ?, genero = ?, ano = ? WHERE id = ?', [titulo, genero, ano, id]);
    }

    function editaFilme(id) {
        setId(id);
        const filme = getFilmeById(id);
        if (!filme) return;
        preencheCampos(filme.titulo, filme.genero, filme.ano);
    }

    function resetId() {
        setId(null);
        limpaCampos();
    }

    function carregarFilmes() {
        const dados = getFilmes();
        setFilmes(dados);
    }


    function salvarFilme(id) {
        const tit = titulo.trim();
        const cat = genero.trim();
        const an = parseInt(ano);

        if (!tit) {
            Alert.alert("Erro", "Titulo não pode estar vazio.");
            return;
        }

        if (!id) {
            insertFilme(tit, cat, an);

        } else { updateFilme(id, tit, cat, an); resetId() }

        limpaCampos();
    }

    function killFilme(id) {
        db.runSync('DELETE FROM filmes WHERE id = ?', [id]);
        carregarFilmes();
    }

    function limpaCampos() {
        setTitulo("");
        setGenero("");
        setAno("");
        carregarFilmes();
    }

    function preencheCampos(titulo, genero, ano) {
        const tit = titulo.trim();
        const gen = genero.trim();
        const an = ano;

        setTitulo(tit);
        setGenero(gen);
        setAno(an);
        carregarFilmes();
    }

    useEffect(() => {
        initDb();
        carregarFilmes();
    }, []);

    return (
        <SafeAreaView style={styles.tela}>
            <Text style={styles.title}>Meus Filmes</Text>

            <View style={styles.forms}>
                <TextInput
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Titulo"
                    style={styles.input}
                />
                <TextInput
                    value={genero}
                    onChangeText={setGenero}
                    placeholder="Genero"
                    style={styles.input}
                />
                <TextInput
                    value={ano}
                    onChangeText={setAno}
                    placeholder="Ano"
                    keyboardType="numeric"
                    style={styles.input}
                />
                <Button title="Salvar" onPress={() => salvarFilme(id)} />
                <Button title="Cancelar" onPress={resetId} />
            </View>

            <Button title="Carregar filmes" onPress={carregarFilmes} />

            <FlatList
                data={filmes}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Text style={styles.item}>
                        - {item.titulo} | {item.genero} |Ano {item.ano} | <Button title="Editar" onPress={() => editaFilme(item.id)} /> | <Button title="Excluir" onPress={() => killFilme(item.id)} />
                    </Text>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tela: {
        flex: 1,
        padding: 16
    },
    forms: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
        flexWrap: "wrap"
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        minWidth: "40%"
    },
    item: {
        fontSize: 16,
        paddingVertical: 6
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8
    },
}
)