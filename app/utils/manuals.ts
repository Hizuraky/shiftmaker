// 操作説明画面目次
export const tableOfContents = [
  {
    title: "シフト作成",
    contents: ["作成画面表示", "年月選択", "各情報確認", "シフト操作説明", "手動入力(STEP1)", "自動入力(STEP2)", "調整(STEP3)"]
  },
  {
    title: "作成済シフト",
    contents: ["シフト確認", "シフト編集", "エクセル出力"]
  },
  {
    title: "その他",
    contents: ["各種変更", "退会", "お問い合わせ"]
  }
]

export const manuals = [
  {
    title: "シフト作成",
    contents: [
      {
        title: "作成画面表示",
        text: ["シフト作成はスライダーの「シフト新規作成」もしくは「シフト作成」ボタンから行えます。"],
        src: ["https://ks-icons.s3.ap-northeast-1.amazonaws.com/p1.png", "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s1.png"]
      },
      {
        title: "年月選択",
        text: ["作成するシフトの年月を選択し、「各種確認」ボタンより次の画面へお進みください。"],
        src: ["https://ks-icons.s3.ap-northeast-1.amazonaws.com/p2.png", "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s2.png"]
      },
      {
        title: "各情報確認",
        text: [
          `
            表示している従業員情報・勤務時間帯の情報を確認し、問題なければ「自動生成」ボタンで次の画面へお進みください。
            従業員と勤務時間帯を編集する場合は「各種編集」ボタンから編集できます。
          `
        ],
        src: ["https://ks-icons.s3.ap-northeast-1.amazonaws.com/p3.png", "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s3.png"]
      },
      {
        title: "シフト操作説明",
        text: [
          `
            シフト作成画面では3つのSTEPで入力してきます。
            STEP1(休暇等手動入力)->STEP2(自動生成)->STEP3(手動調整)でシフトを作成します。
            当段落では各表示パーツの説明になります。
            ・「操作手順」をクリックすると現在の入力する情報、手順を確認できます。
          `,
          `・[各従業員 / 日]エリアをクリックするとシフトを入力できます。`,
          `・[日]エリアをタップすると全従業の該当日のシフトを一括入力できます。`,
          `・それぞれ各日の合計勤務人数、各従業員の月合計勤務数を確認できます。各従業員の月合計勤務数はPC版では「開く」「閉じる」ボタンで開閉できます。`,
          `・「中断 / 一時保存」ボタンをクリックすると、シフトの破棄もしくは一時保存ができます。`
        ],
        src: [
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p6.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s6.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p4.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s4.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p5.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s5.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p7.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s7.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p10.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s10.png"
        ]
      },
      {
        title: "手動入力(STEP1)",
        text: [
          `
            STEP1では事前に確定している出勤情報や休暇情報を入力してください。
            手動入力が完了しましたら、「次へ」ボタンでSTEP2へ進みます。
            「一括リセット」ボタンをクリックするとSTEP1で入力した情報をリセットできます。
          `
        ],
        src: ["https://ks-icons.s3.ap-northeast-1.amazonaws.com/p4.png", "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s4.png"]
      },
      {
        title: "自動入力(STEP2)",
        text: [
          `
            STEP2では「自動生成」ボタンをクリックすると空欄になっている箇所を自動で埋めていきます。
            条件に当てはまる勤務時間帯をランダムに入力しているため、自動生成後も「自動生成」ボタンを再度クリックすると異なるシフトが生成されます。
            自動生成が完了しましたら「次へ」ボタンでSTEP3へ進みます。
            自動生成では以下の条件で入力されます。
            1. 希望休 + 休 を合わせて月で8日になるように入力されます。
            2. 各従業員が勤務可能な勤務時間帯の中から、各日必要人数に達していない場合に割り当てられます。
            ※注意事項
            　・従業員情報・勤務時間帯情報によっては必要最低人数に達しない、休暇が8日に満たない場合はあります。
            　・条件に当てはまらない箇所は空欄のままになります。
          `
        ],
        src: ["https://ks-icons.s3.ap-northeast-1.amazonaws.com/p8.png", "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s8.png"]
      },
      {
        title: "調整(STEP3)",
        text: [
          `
            STEP3では空欄部分を手動入力、自動生成されたシフトを調整してください。
            「空欄休暇埋め」ボタンをクリックすると空欄部分が一括で「休」になります。
            「リセット」ボタンをクリックするとSTEP3で入力・変更したシフトのみが入力されます。
            「シフト名」を入力フォームへ入力してください。
            全て入力し終わりましたら「作成完了」ボタンをクリックするとシフトが保存されます。
          `
        ],
        src: ["https://ks-icons.s3.ap-northeast-1.amazonaws.com/p9.png", "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s9.png"]
      }
    ]
  },
  {
    title: "作成済シフト",
    contents: [
      {
        title: "シフト確認",
        text: [
          `
            作成 / 一時保存したシフトは、シフト一覧画面より確認できます。
            選択すると該当月のシフト一覧を確認できます。
            シフト名をクリックすると作成したシフトの詳細を確認できます。
          `,
          "",
          "作成済シフトの詳細は以下のように表示されます。",
          "一時保存シフトの詳細は以下のように表示されます。"
        ],
        src: [
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p14.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s14.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p11.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s11.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p12.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s12.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p13.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s13.png"
        ]
      },
      {
        title: "シフト編集",
        text: [
          `
            作成済のシフト詳細から、「編集」もしくは「複製編集」ボタンをクリックでシフトの編集ができます。
            「編集」では作成済シフトに上書き保存され、「複製編集」では別シフトとして保存されます。
          `,
          `
            編集画面では「リセット」「自動生成」「空欄休暇埋め」「編集確定」ボタンが表示されています。
            「リセット」ボタンはシフトの内容が全てリセットされます。
            「自動生成」ボタンはシフトがリセットされてから自動生成されます。
            「空欄休暇埋め」ボタンは空欄が全て「休」になります。
            「編集確定」ボタンをクリックすると変更内容が反映されます。
          `
        ],
        src: [
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p12.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s12.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p15.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s15.png"
        ]
      },
      {
        title: "エクセル出力",
        text: [
          `
            作成済のシフト詳細から「エクセル出力」ボタンをクリックすると表示しているシフトが記載されたエクセルファイルをダウンロードできます。
          `,
          `
            ダウンロードしたエクセルファイルは以下のように表示されます。
          `
        ],
        src: [
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p16.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/s16.png",
          "https://ks-icons.s3.ap-northeast-1.amazonaws.com/p17.png"
        ]
      }
    ]
  },
  {
    title: "その他",
    contents: [
      {
        title: "各種変更",
        text: [
          `
            当サービスでは新規登録時の情報は変更できなくなっています。
          `
        ],
        src: [""]
      },
      {
        title: "退会",
        text: [
          `
            退会はマイページよりの「退会はこちらから > 」ボタンより行えます。
            退会すると当サイトにおける全てのデータが削除され、戻すことはできませんのでご注意ください。
          `
        ],
        src: [""]
      },
      {
        title: "お問い合わせ",
        text: [
          `
            当サイトではお問い合わせ窓口を用意していません。
            後日対応予定ですので今しばらくお待ちください。
          `
        ],
        src: [""]
      }
    ]
  }
]
