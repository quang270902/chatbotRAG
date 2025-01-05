import mysql.connector
from flask import jsonify
from datetime import datetime

class ChatHistoryModel:
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'user': 'root',
            'password': 'Hmq270902',
            'database': 'pdvn',
            'port': 3308,
            'auth_plugin': 'mysql_native_password',
            'charset': 'utf8mb4'  # Chỉ định bảng mã ký tự UTF-8
        }
        self.conn = None

    def connect(self):
        try:
            self.conn = mysql.connector.connect(**self.db_config)
            print("Connected to MySQL database successfully!")
        except mysql.connector.Error as e:
            print(f"Error: {e}")

    def close_connection(self):
        if self.conn:
            self.conn.close()
            print("Connection closed.")

    def get_all_messages_by_conversation(self, session_id):
        if not self.conn:
            self.connect()
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Message WHERE Session_ID = %s ORDER BY Created_at ASC", (session_id,))
        result = cursor.fetchall()
        cursor.close()
        return result
    
    def get_all_conversations(self):
        if not self.conn:
            self.connect()
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Conversation ORDER BY Created_at DESC")
        result = cursor.fetchall()
        cursor.close()

        conversations_by_date = {}

        for row in result:
            created_at = row['Created_at']
            if isinstance(created_at, datetime):
                created_at = created_at.strftime('%Y-%m-%d')

            date = datetime.strptime(created_at, '%Y-%m-%d').date()

            if str(date) not in conversations_by_date:
                conversations_by_date[str(date)] = {
                    "date": str(date),
                    "conversations": []
                }

            conversations_by_date[str(date)]["conversations"].append(row)

        # Returning the grouped conversations by date as a list of JSON objects
        return list(conversations_by_date.values())


    def add_Conversation(self, session_id, title):
        if not self.conn:
            self.connect()
        cursor = self.conn.cursor()
        query = "INSERT INTO Message (Session_ID, User, Bot) VALUES (%s, %s, %s)"
        try:
            cursor.execute(query, (session_id, title))
            self.conn.commit()
            print("Chat history added successfully!")
        except mysql.connector.Error as e:
            print(f"Error: {e}")
        finally:
            cursor.close()

    def add_chat_history(self, session_id, user, bot, context1, context2):
        if not self.conn:
            self.connect()
        cursor = self.conn.cursor()

        # Kiểm tra session_id có tồn tại trong bảng Conversation không
        query_check_session = "SELECT * FROM Conversation WHERE Session_ID = %s"
        cursor.execute(query_check_session, (session_id,))
        result = cursor.fetchone()

        # Nếu không tồn tại, tạo Conversation mới
        if result is None:
            query_insert_conversation = "INSERT INTO Conversation (Session_ID, title) VALUES (%s, %s)"
            try:
                cursor.execute(query_insert_conversation, (session_id, user))
                self.conn.commit()
                print("New conversation created successfully!")
            except mysql.connector.Error as e:
                print(f"Error: {e}")
                cursor.close()
                return

        # Lưu chat history vào bảng Message
        query_insert_message = "INSERT INTO Message (Session_ID, User, Bot, Context1, Context2) VALUES (%s, %s, %s, %s, %s)"
        try:
            cursor.execute(query_insert_message, (session_id, user, bot, context1, context2,))
            self.conn.commit()
            conversation_with_messages = jsonify({"message":"Chat history added successfully!"})
        except mysql.connector.Error as e:
            conversation_with_messages = jsonify({"message":"Cannot save message"})

        return conversation_with_messages
    
    def delete_conversation(self, session_id):
        if not self.conn:
            self.connect()
        cursor = self.conn.cursor()
        query = "DELETE FROM Conversation WHERE Session_ID = %s"
        try:
            cursor.execute(query, (session_id,))
            self.conn.commit()
            if cursor.rowcount == 0:
                return False  # Không có dòng nào bị xóa
            print("Delete conversation successfully!")
            return True
        except mysql.connector.Error as e:
            print(f"Error: {e}")
            return False
        finally:
            cursor.close()

    def update_conversation(self, session_id, title):
        if not self.conn:
            self.connect()
        cursor = self.conn.cursor()
        query = "UPDATE Conversation SET Title = %s WHERE Session_ID = %s"
        try:
            cursor.execute(query, (title, session_id,))
            self.conn.commit()
            print("Update conversation successfully!")
            return True
        except mysql.connector.Error as e:
            print(f"Error: {e}")
            return False
        finally:
            cursor.close()


