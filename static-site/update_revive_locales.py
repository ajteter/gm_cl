import os
import json
from deep_translator import GoogleTranslator

def update_revive_locales():
    locales_dir = 'src/i18n/locales'
    en_file = os.path.join(locales_dir, 'en-US.json')
    zh_file = os.path.join(locales_dir, 'zh-CN.json')
    
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    with open(zh_file, 'r', encoding='utf-8') as f:
        zh_data = json.load(f)

    # Simplified Chinese strings as agreed
    zh_updates = {
        "revive.title": "想再试一次吗？",
        "revive.subtitle": "点击下方按钮，即可从原地接力继续。",
        "revive.watchButton": "立即接力继续",
        "revive.loadingButton": "准备中...",
        "revive.almostTitle": "即将重返！",
        "revive.adPlaying": "正在为您接通...请稍候",
        "revive.revivingTitle": "准备返回...",
        "revive.loadingAdTitle": "请求中..."
    }
    
    # Update zh-CN first
    for key, val in zh_updates.items():
        zh_data[key] = val
    
    with open(zh_file, 'w', encoding='utf-8') as f:
        json.dump(zh_data, f, ensure_ascii=False, indent=2)
    print("Updated zh-CN.json")

    # Keys to translate from English
    keys_to_update = list(zh_updates.keys())
    source_texts = {key: en_data[key] for key in keys_to_update}

    files = [f for f in os.listdir(locales_dir) if f.endswith('.json') and f not in ['en-US.json', 'zh-CN.json']]
    
    # Special case for zh-TW (Traditional Chinese)
    zh_tw_updates = {
        "revive.title": "想再試一次嗎？",
        "revive.subtitle": "點擊下方按鈕，即可從原地接力繼續。",
        "revive.watchButton": "立即接力繼續",
        "revive.loadingButton": "準備中...",
        "revive.almostTitle": "即將重返！",
        "revive.adPlaying": "正在為您接通...請稍候",
        "revive.revivingTitle": "準備返回...",
        "revive.loadingAdTitle": "請求中..."
    }

    for filename in files:
        filepath = os.path.join(locales_dir, filename)
        lang_code = filename.replace('.json', '')
        
        # Mapping lang codes to Google Translator codes
        target_lang = lang_code.split('-')[0]
        if lang_code == 'zh-TW':
            target_lang = 'zh-TW'
        elif lang_code == 'pt-BR':
            target_lang = 'pt'
        
        print(f"Translating for {lang_code}...")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if lang_code == 'zh-TW':
            for key, val in zh_tw_updates.items():
                data[key] = val
        else:
            translator = GoogleTranslator(source='en', target=target_lang)
            for key, text in source_texts.items():
                try:
                    translated = translator.translate(text)
                    data[key] = translated
                except Exception as e:
                    print(f"Error translating {key} for {lang_code}: {e}")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
    print("All locales updated.")

if __name__ == "__main__":
    update_revive_locales()
