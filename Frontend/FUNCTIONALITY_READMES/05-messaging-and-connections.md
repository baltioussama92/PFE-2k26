# Fonctionnalité - Messagerie & Connexions

## Frontend concerné

- `src/services/messageService.ts`
- `src/services/connectionService.ts`

## Endpoints Backend requis

### Messagerie
- `POST /api/messages`
- `GET /api/messages/inbox`
- `GET /api/messages/sent`
- `GET /api/messages/conversations`
- `GET /api/messages/conversations/{userId}`

### Connexions
- `GET /api/connections`
- `GET /api/connections/pending`
- `POST /api/connections/request`
- `PATCH /api/connections/{id}/accept`

## Checkpoints sécurité

- Toutes les routes réservées aux utilisateurs authentifiés
- Vérifier que l'utilisateur ne lit que ses propres messages/conversations
- Vérifier que seule la cible d'une demande peut l'accepter
- Protection anti-spam recommandée sur l'envoi de messages et demandes
