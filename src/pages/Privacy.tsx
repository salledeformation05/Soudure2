export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Politique de Confidentialité
      </h1>

      <div className="prose prose-lg max-w-none space-y-8">
        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700">
            AlphaCadeau s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité
            décrit comment nous collectons, utilisons et protégeons vos données personnelles conformément au
            Règlement Général sur la Protection des Données (RGPD).
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données collectées</h2>
          <p className="text-gray-700 mb-3">
            Nous collectons les données suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Données d'identification :</strong> nom, prénom, adresse email, téléphone</li>
            <li><strong>Données de connexion :</strong> adresse IP, logs de connexion, cookies</li>
            <li><strong>Données de paiement :</strong> informations de facturation (via prestataires sécurisés)</li>
            <li><strong>Données de navigation :</strong> pages visitées, designs consultés, favoris</li>
            <li><strong>Données de commande :</strong> historique d'achats, adresses de livraison</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation des données</h2>
          <p className="text-gray-700 mb-3">
            Vos données sont utilisées pour :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Gérer votre compte et vos commandes</li>
            <li>Traiter vos paiements de manière sécurisée</li>
            <li>Améliorer nos services et votre expérience utilisateur</li>
            <li>Vous envoyer des notifications relatives à vos commandes</li>
            <li>Vous informer de nos actualités (avec votre consentement)</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Partage des données</h2>
          <p className="text-gray-700 mb-3">
            Vos données peuvent être partagées avec :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Prestataires de production :</strong> pour la réalisation de vos commandes</li>
            <li><strong>Prestataires de paiement :</strong> pour le traitement sécurisé des transactions</li>
            <li><strong>Services de livraison :</strong> pour l'acheminement de vos commandes</li>
            <li><strong>Autorités légales :</strong> sur réquisition judiciaire</li>
          </ul>
          <p className="text-gray-700 mt-3">
            Nous ne vendons ni ne louons vos données personnelles à des tiers.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sécurité des données</h2>
          <p className="text-gray-700">
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger
            vos données contre tout accès, modification, divulgation ou destruction non autorisés. Les données de
            paiement sont traitées par des prestataires certifiés PCI-DSS et ne sont jamais stockées sur nos serveurs.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Conservation des données</h2>
          <p className="text-gray-700">
            Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont
            collectées, conformément aux obligations légales applicables. Les données de commande sont conservées
            10 ans à des fins comptables et fiscales.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Vos droits</h2>
          <p className="text-gray-700 mb-3">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
            <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
            <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit à la limitation :</strong> demander la limitation du traitement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
          </ul>
          <p className="text-gray-700 mt-3">
            Pour exercer ces droits, contactez-nous à : privacy@alphacadeau.fr
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies</h2>
          <p className="text-gray-700">
            Nous utilisons des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre
            navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient être limitées.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications</h2>
          <p className="text-gray-700">
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les
            modifications entreront en vigueur dès leur publication sur le site.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact</h2>
          <p className="text-gray-700">
            Pour toute question concernant cette politique de confidentialité ou l'utilisation de vos données,
            contactez notre Délégué à la Protection des Données :
          </p>
          <p className="text-gray-700 mt-3">
            Email : privacy@alphacadeau.fr<br />
            Adresse : 123 Avenue des Champs-Élysées, 75008 Paris, France
          </p>
        </section>

        <div className="card bg-gray-50">
          <p className="text-sm text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  )
}
