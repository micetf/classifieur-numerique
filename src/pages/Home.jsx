import React from "react";
import ClassifieurNumerique from "../components/ClassifieurNumerique/index";

const Home = () => {
    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Classifieur Numérique CPC-NE
                </h1>
                <p className="text-gray-600">
                    Cet outil vous aide à organiser vos documents pédagogiques
                    selon l'arborescence officielle CPC ou votre arborescence
                    personnelle.
                </p>

                <div className="mt-4 p-4 bg-blue-50 rounded-md border-l-4 border-blue-500">
                    <h2 className="text-md font-medium text-blue-800 mb-1">
                        Comment ça fonctionne ?
                    </h2>
                    <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                        <li>
                            Choisissez votre méthode d'entrée (upload de
                            document ou description)
                        </li>
                        <li>
                            Sélectionnez l'arborescence à utiliser (CPC ou
                            personnelle)
                        </li>
                        <li>Validez ou modifiez la classification proposée</li>
                        <li>
                            Générez et copiez les commandes Linux pour ranger
                            votre document
                        </li>
                    </ol>
                </div>
            </div>

            <ClassifieurNumerique />
        </div>
    );
};

export default Home;
