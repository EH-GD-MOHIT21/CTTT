import json
from channels.generic.websocket import AsyncWebsocketConsumer
from tictactoe.models import GameManager
from asgiref.sync import sync_to_async
from django.core.cache import cache
from .gameutils import *


class ChatConsumer(AsyncWebsocketConsumer):
    ignore = True
    player_id = None

    def update_active(self):
        try:
            gm = GameManager.objects.get(gametoken=self.room_name)
            users = gm.Game_users.split("($de$)")
            if self.scope["user"].username in users:
                self.ignore = False
                return (False,None)
            if gm.active_members < 2:
                if gm.Game_users == '' or gm.Game_users == None:
                    gm.Game_users += str(self.scope["user"].username)
                else:
                    gm.Game_users = gm.Game_users + \
                        "($de$)" + self.scope["user"].username
                if gm.active_members == 0:
                    self.player_id = "X"
                else:
                    self.player_id = "O"
                gm.active_members += 1
                gm.save()
                if gm.active_members == 2:
                    Game_Matrix = [['' for i in range(3)] for j in range(3)]
                    try:
                        cache.delete_pattern(self.room_name)
                    except:
                        pass
                    cache.set(self.room_name, Game_Matrix)
                    try:
                        cache.delete_pattern(str(self.room_name)+"move")
                    except:
                        pass
                    cache.set(str(self.room_name)+"move", "O")
                    return(True,"Let's start the game")
                return (True,None)
            return (False,None)
        except:
            return (False,None)

    def update_inactive(self):
        try:
            gm = GameManager.objects.get(gametoken=self.room_name)
            users = gm.Game_users.split("($de$)")
            if self.scope["user"].username in users:
                gm.active_members -= 1
                users.remove(self.scope["user"].username)
                if len(users):
                    gm.Game_users = users[0]
                else:
                    gm.Game_users = ''
                gm.save()
        except:
            pass

    def get_active(self):
        try:
            return GameManager.objects.get(gametoken=self.room_name).active_members
        except Exception as e:
            return None

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        if not self.scope["user"].is_authenticated:
            self.close()

        else:
            status,message = await sync_to_async(self.update_active, thread_sensitive=True)()
            if status:

                # Join room group
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )

                await self.accept()

                if message!=None:
                    await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                    'type': 'chat_message',
                    'message': f"{message}",
                    "additional": True,
                    "move": 'X'
                    }
            )

            else:
                self.ignore = False
                self.close()

    async def disconnect(self, close_code):
        # Leave room group
        if self.scope["user"].is_authenticated and self.ignore:
            await sync_to_async(self.update_inactive, thread_sensitive=True)()

        if await sync_to_async(self.get_active, thread_sensitive=True)() < 2:
            username = self.scope["user"].username
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': f"{username} Left the game You Won",
                    "additional": True,
                    "move": None
                }
            )

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        position = message
        Game_over = False

        if await sync_to_async(self.get_active, thread_sensitive=True)() == 2:
            username = self.scope["user"].username
            pre_matrix = cache.get(self.room_name)
            try:
                cache.delete_pattern(self.room_name)
            except:
                pass
            i, j = getMatrixPositionByMove(message)
            # print(cache.get(str(self.room_name)+"move"),self.player_id)
            if cache.get(str(self.room_name)+"move") == self.player_id:
                additional = True
                if self.player_id == "X":
                    message = "It's turn for O please wait for their move."
                else:
                    message = "It's turn for X please wait for their move."
            elif(pre_matrix[i][j] == ''):
                pre_matrix[i][j] = self.player_id
                additional = False
                try:
                    cache.delete_pattern(str(self.room_name)+"move")
                except:
                    pass
                cache.set(str(self.room_name)+"move", self.player_id)
                winner = is_Game_End(pre_matrix)
                if winner != None and winner != 'tie':
                    additional = True
                    message = f"Hurrey! {username} Won the Game."
                    Game_over = True
                elif winner == 'tie':
                    additional = True
                    message = f"Hurrey! You both played well It's a tie."
                    Game_over = True
            else:
                additional = True
                message = f"Invalid Move by {username} Position already filled."
            cache.set(self.room_name, pre_matrix)
            # print(pre_matrix)
            # Send message to room group
            if not Game_over:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message,
                        "additional": additional,
                        "move": self.player_id,
                        "is_game": False
                    }
                )
            else:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message,
                        "additional": additional,
                        "move": self.player_id,
                        "is_game": True,
                        "position": position
                    }
                )

        else:
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': "Waiting For Second Player to Join",
                    "additional": True,
                    "move": self.player_id
                }
            )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        additional = event["additional"]
        player_id = event["move"]
        if cache.get(str(self.room_name)+"move") == "X":
            next_move = "O"
        else:
            next_move = "X"
        try:
            is_game = event["is_game"]
            position = event["position"]
        except:
            is_game = False
            position = None

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            "additional": additional,
            "move": player_id,
            "is_game": is_game,
            "position": position,
            "next_move":next_move,
            "time":30
        }))
