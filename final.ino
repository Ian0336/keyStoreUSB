#include <EEPROM.h>
#include <Wire.h>
#include <LiquidCrystal_PCF8574.h>
#include <string.h>
#include <WebUSB.h>
#include <ArduinoJson.h>
#include <MFRC522.h>
#include <Wire.h>
#include <SPI.h>


#define RST_PIN    9
#define SS_PIN     5

WebUSB WebUSBSerial(1 /*https:// */, "webusb");
StaticJsonDocument<200> doc;
MFRC522 mfrc522;

#define Serial WebUSBSerial

LiquidCrystal_PCF8574 lcd(0x3F);
//button in Pin 2
const int button = 4;
// const int ledpin = 13;
int buttonState = 0;
bool btnRelease = true;

struct Entry {
    char url[32];
    char account[16];
    char password[16];
};

struct User {
    byte username[4];
    bool used = false;
    int entry_num = 0;
    struct Entry entries[7];
};

int num_add = 2 * sizeof(User);

// two mode, verify and modify

enum Mode {
    VERIFY,
    MODIFY
};

enum State {
    IDLE,
    ADD,
    DELETE,
};

void deleteUser(int index, int new_num) {
    int addr = index * sizeof(User);
    User user;
    user.used = false;
    user.entry_num = 0;
    EEPROM.put(addr, user);
    EEPROM.put(num_add, new_num);
}

void writeUser(int index, byte* newUser, int new_num, bool used) {
    int addr = index * sizeof(User);
    User user;
    user.used = used;
    Serial.print("new username: ");
    for (int i = 0; i < 4; ++i) {
      user.username[i] = newUser[i];
      Serial.print(user.username[i]);
    }
    Serial.println();
    EEPROM.put(addr, user);
    EEPROM.put(num_add, new_num);
}

int getUserNum() {
    int num = 0;
    EEPROM.get(num_add, num);
    return num;
}

User readUser(uint16_t index) {
    int addr = index * sizeof(User);
    User user;
    EEPROM.get(addr, user);
    return user;
}

bool checkUser(byte* uid, bool need) {
  User usertmp;
  int usernum;
  EEPROM.get(num_add, usernum);
  if (usernum == 0 && need) {
    return true;
  }
  for (int i = 0; i < 2; ++i) {
    int addr = i * sizeof(User);
    EEPROM.get(addr, usertmp);
    if (!usertmp.used) continue;
    bool match = true;
    for (int i = 0; i < 4; ++i) {
      if (uid[i] != usertmp.username[i]) match = false;
    }
    if (match) return true;
  }
  return false;
}

void display_LCD1(char* str) {
    // lcd.clear();
    lcd.setBacklight(255);
    lcd.setCursor(0, 0);
    lcd.print(str);
}

void display_LCD2(char* str) {
    // lcd.clear();
    lcd.setBacklight(255);
    lcd.setCursor(0, 1);
    lcd.print(str);
}

int findempty() {
  User user;
  EEPROM.get(0, user);
  if (!user.used) return 0;
  EEPROM.get(sizeof(User), user);
  if (!user.used) return 1;
}

int findUser(byte* uid) {
  User user;
  EEPROM.get(0, user);
  bool found = true;
  for (int i = 0; i < 4; ++i) {
    if (uid[i] != user.username[i]) {
      found = false;
      break;
    }
  }
  if (found) return 0;
  EEPROM.get(sizeof(User), user);
  found = true;
  for (int i = 0; i < 4; ++i) {
    if (uid[i] != user.username[i]) {
      found = false;
      break;
    }
  }
  if (found) return 1;
  else return -1;
}

void updateUser(int index, User user) {
  int add = index * sizeof(User);
  // EEPROM.put(add, user);
}


State state = IDLE;
Mode mode = MODIFY;
    

void setup() {
    Serial.begin(9600);
    lcd.begin(16, 2);

    //initializeEPPROM();

    SPI.begin();

    User user1, user2;

    // put two user inside EEPROm
    // strcpy(user1.username, "user1");
    // strcpy(user2.username, "user2");

    // int i = 0;
    // EEPROM.put(2 * sizeof(User), i);
    // EEPROM.put(0, user1);
    // EEPROM.put(sizeof(User), user1);
    // set up button
    pinMode(button, INPUT);
    // pinMode(ledpin, OUTPUT);
    mfrc522.PCD_Init(SS_PIN, RST_PIN);
    // Serial.print(F("Reader "));
    // Serial.print(F(": "));
    // mfrc522.PCD_DumpVersionToSerial(); // 顯示讀卡設備的版本
}

bool reading = false;
int count = 0;
bool startverify = false;
char tmp;
char json[150], json_output[150];//, tmpjs[100];
const char* newtype;
const char* newurl;
char* tmpchar;
char* tmpchar_verify;
String tempst = "";

// const char* newtype = doc["type"];
// const char* newurl = doc["url"];

void loop() {
  // User nowUser = readUser(0);
  // Serial.println(nowUser.username);
    buttonState = digitalRead(button);
    if(buttonState == LOW) btnRelease = true;
    // if finger detected, change state to add
    if (mode == MODIFY) {
        if (Serial && Serial.available() && !startverify) {
          display_LCD2("Serial          ");
          // display_LCD1("MODIFY MODE");
          //read string, if read "
          tmp = Serial.read();
          if (tmp == '{') {json[0] = tmp; reading = true; count = 1;}
          else {json[count++] = tmp;}
          if(tmp  == '}' && json[0] == '{'){
            // display_LCD2(json);
            // while(1);
            mode = VERIFY;
            reading = false;
            startverify = true;
          } 

        } 
        if (!reading) {
            //TODO
            if (state == IDLE) {
              display_LCD1("MODIFY MODE");
              display_LCD2("                ");
              // Serial.println("in indle");
              if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
                // Serial.print(F("Card UID:"));
                // dump_byte_array(mfrc522.uid.uidByte, mfrc522.uid.size); // 顯示卡片的UID
                // Serial.println();
                // Serial.print(F("PICC type: "));
                // MFRC522::PICC_Type piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
                // Serial.println(mfrc522.PICC_GetTypeName(piccType));  //顯示卡片的類型

                if (checkUser(mfrc522.uid.uidByte, true)) {
                  state = ADD;
                  display_LCD2("Please wait...");
                  delay(2000);
                } else {
                  display_LCD2("USER NOT FOUND");
                  delay(2000);
                }

              }
            } else if (state == ADD) {
                // detect button interrupt
                display_LCD1("ADD    MODE");
                display_LCD2("                ");
                if (buttonState == HIGH && btnRelease) {
                    delay(100);
                    buttonState = digitalRead(button);
                    if (buttonState == HIGH) {
                      // Serial.println("button pressed");
                      lcd.clear();
                      btnRelease = false;
                        state = DELETE;
                    }
                } else if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
                    // add entry
                    // check if user exists
                    int usernum = getUserNum();
                    if (usernum < 2 && (!checkUser(mfrc522.uid.uidByte, false))) {
                      int emptyid = findempty();
                      writeUser(emptyid, mfrc522.uid.uidByte, usernum+1, true);
                      display_LCD2("Please wait...");
                      state = IDLE;
                    } else {
                        /*no space for new user*/
                        // Serial.println("user already in or full");
                        display_LCD2("USER EXISTS");
                    }
                    state = IDLE;
                    delay(2000);
                }
            } else {
                display_LCD1("DELETE MODE");
                display_LCD2("                ");
                if (buttonState == HIGH && btnRelease) {

                    delay(100);
                    buttonState = digitalRead(button);
                    if (buttonState == HIGH) {
                      // Serial.println("button pressed");
                      lcd.clear();
                      btnRelease = false;
                      state = ADD;
                    }
                } else if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
                    // find entry with userID
                    // delete entry if exists
                    int usernum = getUserNum();
                    if (usernum > 0) {
                      int existUser = findUser(mfrc522.uid.uidByte);
                      if (existUser == -1) {
                        // Serial.println('User not found');
                        display_LCD2("USER NOT FOUND");
                      } else {
                        // Serial.print("deleting user");
                        // Serial.println(existUser);
                        display_LCD2("Please wait...");
                        deleteUser(existUser, usernum-1);
                        
                      }
                    } else {
                      display_LCD2("USER NOT FOUND");
                      // Serial.println("no user inside with usernum: ");
                      // Serial.print(usernum);
                    }
                    delay(2000);
                    state = IDLE;
                }
            }
        }
    } else if (mode == VERIFY) {
        display_LCD1("Verifying...");

        // const char* newtype = doc["type"];
        // display_LCD2(newtype);
        // const char* newurl = doc["url"];
        if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
          // char* ppjs = json;
          // if (json[str.length()-1] == '}') {
          //   display_LCD2("Waiting...   ");
          // }
          // else display_LCD2("failed......");
          // display_LCD2(ppjs);
          // while(1);
          
          int existUser = findUser(mfrc522.uid.uidByte);
          DeserializationError error = deserializeJson(doc, json);
          if (error) {
            display_LCD2(json);
            // Serial.print("fuck");
            // Serial.flush();
            // Serial.print(json);
            // Serial.flush();
            Serial.print(F("deserializeJson() failed: "));
            Serial.flush();
            while(1);
            
            return;
          }
          newtype = doc["type"];
          newurl = doc["url"];
          
          
          if (strcmp(newtype, "new") == 0) {
            String newusername = doc["username"];
            String newpassword = doc["password"];
            if (existUser == -1) {
              doc["type"] = "N";
            } else {
              User usertmp;
              EEPROM.get(existUser * sizeof(User), usertmp);
              int existentry = usertmp.entry_num;
              if (existentry >= 10) {
                doc["type"] = "N";
              } else {
                bool find = false;
                for (int i = 0; i < existentry; ++i) {
                  tmpchar = usertmp.entries[i].url;
                  // Serial.print(tmpchar);
                  if (strcmp(tmpchar, newurl) == 0) {
                    for (int j = 0; j < newusername.length(); ++j) usertmp.entries[i].account[j] = newusername[j];
                    for (int j = 0; j < newpassword.length(); ++j) usertmp.entries[i].password[j] = newpassword[j];
                    find = true;
                    break;
                  }
                }
                if (!find) {
                  tempst = newurl;
                  // Serial.print(tempst);
                  for (int i = 0; i < tempst.length(); ++i) usertmp.entries[existentry].url[i] = tempst[i];
                  usertmp.entries[existentry].url[tempst.length()] = '\0';
                  for (int i = 0; i < newusername.length(); ++i) usertmp.entries[existentry].account[i] = newusername[i];
                  usertmp.entries[existentry].account[newusername.length()] = '\0';
                  for (int i = 0; i < newpassword.length(); ++i) usertmp.entries[existentry].password[i] = newpassword[i];
                  usertmp.entries[existentry].password[newpassword.length()] = '\0';
                  usertmp.entry_num = existentry + 1;
                }
                // Serial.println(usertmp.entries[existentry].url);
                // Serial.flush();
                // updateUser(existUser, usertmp);
                EEPROM.put(existUser * sizeof(User), usertmp);
                doc["type"] = "Y";
                display_LCD2("Please wait...");
                
              }
            }
            
          } else if (strcmp(newtype, "verify") == 0) {
            
            if (existUser == -1) {
              doc["type"] = "N";
              display_LCD2("NO USER       ");
            } else {
              User usertmp;
              EEPROM.get(existUser * sizeof(User), usertmp);
              int existentry = usertmp.entry_num;
              // Serial.print(existentry);
              bool find = false;
              for (int i = 0; i < existentry; ++i) {
                // tmpchar_verify = usertmp.entries[i].url;
                // Serial.println(usertmp.entries[i].url);
                // Serial.flush();
                // Serial.println(newurl);
                if (strcmp(usertmp.entries[i].url, newurl) == 0) {
                  tmpchar = usertmp.entries[i].account;
                  doc["username"] = tmpchar;
                  tmpchar = usertmp.entries[i].password;
                  doc["password"] = tmpchar;
                  // for (int j = 0; j < newusername.length(); ++j) newusername += usertmp.entries[i].account[j];
                  // for (int j = 0; j < newpassword.length(); ++j) newpassword += usertmp.entries[i].password[j];
                  find = true;
                  break;
                }
              }
              if (find) {
                doc["type"] = "Y";
                display_LCD2("Please wait...");
              } else {
                doc["type"] = "N";
                
                display_LCD2("NO DATA       ");
                
              }
            }
            // delay(2000);
            // serializeJson(doc, json_output);
            // Serial.print(json_output);
            // Serial.flush();
            // display_LCD1("CHECK OUTPUT");
            // display_LCD2(json_output); 
            // while(1);
            // mode = MODIFY;
            // state = IDLE;
            // startverify = false;
          } else {
            Serial.print(F("type read failed: "));
            Serial.flush();
            return;
          }
          delay(2000);
          serializeJson(doc, json_output);
          Serial.print(json_output);
          Serial.flush();
          mode = MODIFY;
          state = IDLE;
          startverify = false;
        }
    }

}

void dump_byte_array(byte *buffer, byte bufferSize) {
  // for (byte i = 0; i < bufferSize; i++) {
    // Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    // Serial.print(buffer[i], HEX);
  // }
}