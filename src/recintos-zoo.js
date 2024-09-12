class RecintosZoo {
  constructor() {
      this.recintos = [
          { num: 1, bioma: 'savana', tamT: 10, animais: { especie: 'macaco', qnt: 3 } },
          { num: 2, bioma: 'floresta', tamT: 5, animais: null },
          { num: 3, bioma: 'savana e rio', tamT: 7, animais: { especie: 'gazela', qnt: 1 } },
          { num: 4, bioma: 'rio', tamT: 8, animais: null },
          { num: 5, bioma: 'savana', tamT: 9, animais: { especie: 'leão', qnt: 1 } }
      ];

      this.animais = {
          LEAO: { tam: 3, biomas: ['savana'], carnivoro: true },
          LEOPARDO: { tam: 2, biomas: ['savana'], carnivoro: true },
          CROCODILO: { tam: 3, biomas: ['rio'], carnivoro: true },
          MACACO: { tam: 1, biomas: ['savana', 'floresta'], carnivoro: false },
          GAZELA: { tam: 2, biomas: ['savana'], carnivoro: false },
          HIPOPOTAMO: { tam: 4, biomas: ['savana', 'rio'], carnivoro: false }
      };
  }

  verifRecinto(animal, qnt, recinto) {
      const animalInfo = this.animais[animal];
      if (!animalInfo) {
          return false;
      }

      const { tam, biomas, carnivoro } = animalInfo;
      const espacoNovoOcup = tam * qnt;
      const espacoTotal = recinto.tamT;

      // Verifica se o bioma do recinto é compatível com o animal
      if (!biomas.includes(recinto.bioma)) {
          return false;
      }

      // Se já há animais no recinto
      if (recinto.animais) {
          const { especie, qnt: qntExist } = recinto.animais;
          const animaisExist = this.animais[especie.toUpperCase()];

          if (!animaisExist) {
              return false;
          }

          // Verifica se o animal atual e os animais já existentes no recinto são carnívoros
          if (carnivoro || animaisExist.carnivoro) {
              if (especie.toUpperCase() !== animal) {
                  return false;
              }
          }

          // Verifica espaço ocupado e espaço total necessário
          const espacoOcup = animaisExist.tam * qntExist;
          const espacoTotalOcup = espacoNovoOcup + espacoOcup;
          const espacoNecessario = recinto.animais && especie.toUpperCase() !== animal
              ? espacoTotalOcup + 1
              : espacoTotalOcup;

          if (espacoNecessario > espacoTotal) {
              return false;
          }

          // Verifica regra do macaco (não pode ficar sozinho)
          if (animal === 'MACACO' && qnt === 1 && !recinto.animais) {
              return false;
          }

          // Verifica regra do hipopótamo
          if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
              return false;
          }

          return espacoTotal - espacoNecessario;
      } else {
          const espacoNecessario = espacoNovoOcup + (recinto.animais ? 1 : 0);
          return espacoNecessario <= espacoTotal ? espacoTotal - espacoNecessario : false;
      }
  }

  analisaRecintos(tipoAnimal, quantidade) {
      if (!this.animais[tipoAnimal.toUpperCase()]) {
          return { erro: "Animal inválido" };
      }
      if (quantidade <= 0 || !Number.isInteger(quantidade)) {
          return { erro: "Quantidade inválida" };
      }

      const recintosValidos = this.recintos.map(
          recinto => {
              const espacoLivre = this.verifRecinto(tipoAnimal.toUpperCase(), quantidade, recinto);
              if (espacoLivre !== false) {
                  return `Recinto ${recinto.num} (espaço livre: ${espacoLivre} total: ${recinto.tamT})`;
              }
              return null;
          }
      ).filter(Boolean);

      return recintosValidos.length > 0
          ? { recintosValidos }
          : { erro: "Não há recintos viáveis" };
  }
}

// Testando o programa
const zoo = new RecintosZoo();

console.log(zoo.analisaRecintos("MACACO", 5)); 
console.log(zoo.analisaRecintos("LEAO", 1)); 
console.log(zoo.analisaRecintos("UNICORNIO", 1)); 

export { RecintosZoo as RecintosZoo };
