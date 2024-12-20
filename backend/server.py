from flask import Flask, request, jsonify
from flask_cors import CORS

# Définition de la classe de Contact
class Contact:
    def __init__(self, name, address, phone):
        self.name = name
        self.address = address
        self.phone = phone

    def __repr__(self):
        return f"Contact(name={self.name}, address={self.address}, phone={self.phone})"

# Définition du noeud de l'arbre
class Node:
    def __init__(self, contact):
        self.contact = contact
        self.left = None
        self.right = None

# Arbre binaire de recherche
class BinarySearchTree:
    def __init__(self):
        self.root = None

    def add_contact(self, contact):
        if not self.root:
            self.root = Node(contact)
        else:
            self._add(self.root, contact)

    def _add(self, current_node, contact):
        if contact.name < current_node.contact.name:
            if current_node.left:
                self._add(current_node.left, contact)
            else:
                current_node.left = Node(contact)
        elif contact.name > current_node.contact.name:
            if current_node.right:
                self._add(current_node.right, contact)
            else:
                current_node.right = Node(contact)

    def search_contact(self, name):
        return self._search(self.root, name)

    def _search(self, current_node, name):
        if not current_node:
            return None
        if name.lower() == current_node.contact.name.lower():
            return current_node.contact
        elif name.lower() < current_node.contact.name.lower():
            return self._search(current_node.left, name)
        else:
            return self._search(current_node.right, name)

    def delete_contact(self, name):
        self.root = self._delete(self.root, name)

    def _delete(self, current_node, name):
        if not current_node:
            return None
        if name < current_node.contact.name:
            current_node.left = self._delete(current_node.left, name)
        elif name > current_node.contact.name:
            current_node.right = self._delete(current_node.right, name)
        else:
            if not current_node.left:
                return current_node.right
            elif not current_node.right:
                return current_node.left
            min_larger_node = self._find_min(current_node.right)
            current_node.contact = min_larger_node.contact
            current_node.right = self._delete(current_node.right, min_larger_node.contact.name)
        return current_node

    def _find_min(self, current_node):
        while current_node.left:
            current_node = current_node.left
        return current_node

    def get_all_contacts(self):
        contacts = []
        self._in_order_traversal(self.root, contacts)
        return contacts

    def _in_order_traversal(self, current_node, contacts):
        if current_node:
            self._in_order_traversal(current_node.left, contacts)
            contacts.append(current_node.contact)
            self._in_order_traversal(current_node.right, contacts)

# Initialiser l'application Flask et CORS
app = Flask(__name__)
CORS(app)  # Permet de gérer les requêtes cross-origin depuis Angular

# Créer une instance de l'arbre
address_book = BinarySearchTree()

# Ajouter un contact via l'API
@app.route('/contacts', methods=['POST'])
def add_contact():
    data = request.json
    if not all(key in data for key in ['name', 'address', 'phone']):
        return jsonify({"error": "Missing required fields"}), 400
    contact = Contact(data['name'], data['address'], data['phone'])
    address_book.add_contact(contact)
    return jsonify({"message": "Contact ajouté avec succès"}), 201

@app.route('/contacts/<string:name>', methods=['PUT'])
def update_contact(name):
    data = request.get_json()
    if not all(key in data for key in ['name', 'address', 'phone']):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Chercher le contact à mettre à jour
    contact = address_book.search_contact(name)
    if contact is None:
        return jsonify({"error": "Contact not found"}), 404

    # Supprimer l'ancien contact
    address_book.delete_contact(name)

    # Créer le nouveau contact avec le nouveau nom
    new_name = data.get('name')
    new_address = data.get('address')
    new_phone = data.get('phone')
    updated_contact = Contact(new_name, new_address, new_phone)

    # Ajouter le contact mis à jour
    address_book.add_contact(updated_contact)

    return jsonify({"message": "Contact updated successfully"}), 200

# Rechercher un contact par son nom
@app.route('/contacts/<name>', methods=['GET'])
def search_contact(name):
    contact = address_book.search_contact(name)
    if contact:
        return jsonify({"name": contact.name, "address": contact.address, "phone": contact.phone}), 200
    return jsonify({"message": "Contact non trouvé"}), 404

# Supprimer un contact par son nom
@app.route('/contacts/<name>', methods=['DELETE'])
def delete_contact(name):
    contact = address_book.search_contact(name)
    if contact:
        address_book.delete_contact(name)
        return jsonify({"message": "Contact supprimé avec succès"}), 200
    return jsonify({"message": "Contact non trouvé"}), 404


# Obtenir tous les contacts
@app.route('/contacts', methods=['GET'])
def get_all_contacts():
    contacts = address_book.get_all_contacts()
    result = [{"name": contact.name, "address": contact.address, "phone": contact.phone} for contact in contacts]
    return jsonify(result), 200


if __name__ == '__main__':
    app.run(debug=True)
