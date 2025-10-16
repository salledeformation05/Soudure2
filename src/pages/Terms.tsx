export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Conditions Générales d'Utilisation
      </h1>

      <div className="prose prose-lg max-w-none space-y-8">
        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Objet</h2>
          <p className="text-gray-700">
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme AlphaCadeau
            accessible à l'adresse alphacadeau.fr. L'utilisation de la plateforme implique l'acceptation pleine et
            entière des présentes CGU.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Inscription</h2>
          <p className="text-gray-700 mb-3">
            Pour utiliser les services de la plateforme, l'utilisateur doit créer un compte en fournissant des
            informations exactes et à jour.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>L'utilisateur est responsable de la confidentialité de ses identifiants</li>
            <li>Toute utilisation du compte est présumée effectuée par son titulaire</li>
            <li>L'utilisateur s'engage à notifier immédiatement toute utilisation non autorisée</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Services proposés</h2>
          <p className="text-gray-700 mb-3">
            AlphaCadeau met à disposition une plateforme permettant :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Aux clients : d'acheter des produits personnalisés à partir de designs créés par des artistes</li>
            <li>Aux créateurs : de proposer leurs designs et percevoir des royalties sur les ventes</li>
            <li>Aux prestataires : de produire localement les commandes assignées</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
          <p className="text-gray-700 mb-3">
            Les designs proposés sur la plateforme sont la propriété exclusive de leurs créateurs. Toute reproduction,
            représentation ou utilisation non autorisée est strictement interdite.
          </p>
          <p className="text-gray-700">
            Les créateurs garantissent détenir tous les droits nécessaires sur les designs qu'ils soumettent et
            qu'ils ne portent pas atteinte aux droits de tiers.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Commandes et paiement</h2>
          <p className="text-gray-700 mb-3">
            Les commandes passées sur la plateforme font l'objet d'un contrat de vente entre le client et AlphaCadeau.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Le paiement est effectué au moment de la commande par carte bancaire ou PayPal</li>
            <li>La commande est confirmée après validation du paiement</li>
            <li>Les prix sont indiqués en euros TTC</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Livraison</h2>
          <p className="text-gray-700">
            Les délais de livraison sont communiqués à titre indicatif. AlphaCadeau ne saurait être tenue responsable
            des retards de livraison dus à des circonstances indépendantes de sa volonté.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Droit de rétractation</h2>
          <p className="text-gray-700">
            Conformément au Code de la consommation, le client dispose d'un délai de 14 jours pour exercer son droit
            de rétractation. Ce droit ne s'applique pas aux produits personnalisés conformément aux spécifications
            du client.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Responsabilité</h2>
          <p className="text-gray-700">
            AlphaCadeau ne saurait être tenue responsable des dommages directs ou indirects causés au matériel de
            l'utilisateur lors de l'accès à la plateforme, ni des préjudices liés à l'utilisation du service.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modification des CGU</h2>
          <p className="text-gray-700">
            AlphaCadeau se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront
            informés de toute modification substantielle.
          </p>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Droit applicable</h2>
          <p className="text-gray-700">
            Les présentes CGU sont soumises au droit français. Tout litige sera porté devant les tribunaux compétents.
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
