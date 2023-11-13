CREATE USER 'titiMaster'@'localhost' IDENTIFIED BY 'shiro_gaming';

GRANT ALL PRIVILEGES ON nankuruchat.* TO 'titiMaster'@'localhost';

FLUSH PRIVILEGES;