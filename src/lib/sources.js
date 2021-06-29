export const cryptoMachines = [
  // {
  //   name: 'Apple Macbook Pro 16" i9 2019',
  //   Wh: 95,
  //   performance: {
  //     javascript: {
  //       sign: 1100 * 8 * 60 * 60,
  //       verify: 530 * 8 * 60 * 60,
  //       hash: 7144 * 8 * 60 * 60 // 3k data
  //     },
  //     native: {
  //       sign: 2200 * 8 * 60 * 60,
  //       verify: 1920 * 8 * 60 * 60,
  //       hash: 111150 * 8 * 60 * 60 // 3k data
  //     },
  //   }
  // },

  {
    "name": "Apple Inc. MacBookPro16,1 Core™ i9-9880H",
    "weight": 1,
    "Wh": 45,
    "cores": 8,
    "performance": {
      "javascript": {
        "hash": 327623388,
        "sign": 36082759,
        "verify": 16594903
      },
      "native": {
        "hash": 3145000300,
        "sign": 63083658,
        "verify": 60363418
      }
    },
    "raw": {
      "date": "2020-12-06T09:23:41.711Z",
      "performance": {
        "javascript": {
          "hash": {
            "counter": 22763,
            "diff": 2001
          },
          "sign": {
            "counter": 2507,
            "diff": 2001
          },
          "verify": {
            "counter": 1153,
            "diff": 2001
          }
        },
        "native": {
          "hash": {
            "counter": 218512,
            "diff": 2001
          },
          "sign": {
            "counter": 4383,
            "diff": 2001
          },
          "verify": {
            "counter": 4194,
            "diff": 2001
          }
        }
      },
      "cpu": {
        "manufacturer": "Intel®",
        "brand": "Core™ i9-9880H",
        "vendor": "GenuineIntel",
        "family": "6",
        "model": "158",
        "stepping": "13",
        "revision": "",
        "voltage": "",
        "speed": "2.30",
        "speedmin": "2.30",
        "speedmax": "2.30",
        "governor": "",
        "cores": 16,
        "physicalCores": 8,
        "processors": 1,
        "socket": "",
        "cache": {
          "l1d": 32768,
          "l1i": 32768,
          "l2": 262144,
          "l3": 16777216
        }
      },
      "cpuFlags": "fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clfsh ds acpi mmx fxsr sse sse2 ss htt tm pbe sse3 pclmulqdq dtes64 mon dscpl vmx smx est tm2 ssse3 fma cx16 tpr pdcm sse4.1 sse4.2 x2apic movbe popcnt aes pcid xsave osxsave seglim64 tsctmr avx1.0 rdrand f16c",
      "cpuCurrentspeed": 2.3,
      "system": {
        "manufacturer": "Apple Inc.",
        "model": "MacBookPro16,1",
        "version": "1.0",
        "serial": "C02D27CHMD6T",
        "uuid": "B2AF2F91-89B0-58B2-9BFC-38C7B5E34A1C",
        "sku": "Mac-E1008331FDC96864"
      },
      "battery": {
        "hasbattery": true,
        "cyclecount": 35,
        "ischarging": false,
        "designedcapacity": 110754,
        "maxcapacity": 100724,
        "currentcapacity": 99968,
        "voltage": 12.6,
        "capacityUnit": "mWh",
        "percent": 100,
        "timeremaining": 0,
        "acconnected": true,
        "type": "Li-ion",
        "model": "",
        "manufacturer": "Apple",
        "serial": ""
      }
    }
  },

  {
    "name": "Intel Corporation S1200SP Xeon® E3-1270 v6",
    "weight": 1,
    "Wh": 72,
    "cores": 4,
    "performance": {
     "javascript": {
      "hash": 164135532,
      "sign": 18170915,
      "verify": 8343656
     },
     "native": {
      "hash": 1349857871,
      "sign": 29598801,
      "verify": 34859370
     }
    },
    "raw": {
     "date": "2020-12-06T09:26:01.675Z",
     "performance": {
      "javascript": {
       "hash": {
        "counter": 22808,
        "diff": 2001
       },
       "sign": {
        "counter": 2525,
        "diff": 2001
       },
       "verify": {
        "counter": 1160,
        "diff": 2002
       }
      },
      "native": {
       "hash": {
        "counter": 187574,
        "diff": 2001
       },
       "sign": {
        "counter": 4113,
        "diff": 2001
       },
       "verify": {
        "counter": 4844,
        "diff": 2001
       }
      }
     },
     "cpu": {
      "manufacturer": "Intel®",
      "brand": "Xeon® E3-1270 v6",
      "vendor": "GenuineIntel",
      "family": "6",
      "model": "158",
      "stepping": "9",
      "revision": "",
      "voltage": "",
      "speed": "3.80",
      "speedmin": "0.80",
      "speedmax": "4.20",
      "governor": "powersave",
      "cores": 8,
      "physicalCores": 4,
      "processors": 1,
      "socket": "",
      "cache": {
       "l1d": 32768,
       "l1i": 32768,
       "l2": 262144,
       "l3": 8388608
      }
     },
     "cpuFlags": "fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch epb invpcid_single intel_pt ssbd ibrs ibpb stibp pti tpr_shadow vnmi flexpriority ept vpid fsgsbase tsc_adjust bmi1 hle avx2 smep bmi2 erms invpcid rtm mpx rdseed adx smap clflushopt xsaveopt xsavec xgetbv1 dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d",
     "cpuCurrentspeed": 3.8,
     "system": {
      "manufacturer": "Intel Corporation",
      "model": "S1200SP",
      "version": "....................",
      "serial": "............",
      "uuid": "F186522A-9812-E711-B330-A4BF0120419E",
      "sku": "SKU Number"
     },
     "battery": {
      "hasbattery": false,
      "cyclecount": 0,
      "ischarging": false,
      "designedcapacity": 0,
      "maxcapacity": 0,
      "currentcapacity": 0,
      "voltage": 0,
      "capacityUnit": "",
      "percent": 0,
      "timeremaining": -1,
      "acconnected": true,
      "type": "",
      "model": "",
      "manufacturer": "",
      "serial": ""
     }
    }
   },


   {
    "name": "Supermicro Super Server Xeon® D-1521",
    "weight": 1,
    "Wh": 45,
    "cores": 4,
    "performance": {
     "javascript": {
      "hash": 137458471,
      "sign": 12630569,
      "verify": 5790210
     },
     "native": {
      "hash": 1115255172,
      "sign": 20358621,
      "verify": 23244378
     }
    },
    "raw": {
     "date": "2020-12-06T09:35:31.101Z",
     "performance": {
      "javascript": {
       "hash": {
        "counter": 19101,
        "diff": 2001
       },
       "sign": {
        "counter": 1756,
        "diff": 2002
       },
       "verify": {
        "counter": 805,
        "diff": 2002
       }
      },
      "native": {
       "hash": {
        "counter": 154974,
        "diff": 2001
       },
       "sign": {
        "counter": 2829,
        "diff": 2001
       },
       "verify": {
        "counter": 3230,
        "diff": 2001
       }
      }
     },
     "cpu": {
      "manufacturer": "Intel®",
      "brand": "Xeon® D-1521",
      "vendor": "GenuineIntel",
      "family": "6",
      "model": "86",
      "stepping": "3",
      "revision": "",
      "voltage": "",
      "speed": "2.40",
      "speedmin": "0.80",
      "speedmax": "2.70",
      "governor": "powersave",
      "cores": 8,
      "physicalCores": 4,
      "processors": 1,
      "socket": "",
      "cache": {
       "l1d": 32768,
       "l1i": 32768,
       "l2": 262144,
       "l3": 6291456
      }
     },
     "cpuFlags": "fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc aperfmperf eagerfpu pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch epb intel_pt tpr_shadow vnmi flexpriority ept vpid fsgsbase tsc_adjust bmi1 hle avx2 smep bmi2 erms invpcid rtm cqm rdseed adx smap xsaveopt cqm_llc cqm_occup_llc cqm_mbm_total cqm_mbm_local dtherm ida arat pln pts",
     "cpuCurrentspeed": 2.4,
     "system": {
      "manufacturer": "Supermicro",
      "model": "Super Server",
      "version": "0123456789",
      "serial": "0123456789",
      "uuid": "00000000-0000-0000-0000-0CC47A944C00",
      "sku": "-"
     },
     "battery": {
      "hasbattery": false,
      "cyclecount": 0,
      "ischarging": false,
      "designedcapacity": 0,
      "maxcapacity": 0,
      "currentcapacity": 0,
      "voltage": 0,
      "capacityUnit": "",
      "percent": 0,
      "timeremaining": -1,
      "acconnected": true,
      "type": "",
      "model": "",
      "manufacturer": "",
      "serial": ""
     }
    }
   }
   
   
]

function __prepare(machine) {
  for (var a in machine.performance) {
    const platform = machine.performance[a];
    for (var key in platform) {
      const value = platform[key];
      const rate = (machine.Wh * 1000 * 1000) / value; // µWh
      platform[`_micro_${key}`] = rate;
    }
  }
}
for (var a in cryptoMachines) __prepare(cryptoMachines[a])

export const fuelSources = [
  {
    name: "Essence",
    unit: "l",
    kwh: 9.63,
    co2: 2542,
    meca: 0.34,
    source: "Wikipedia",
    srcLink: "https://fr.wikipedia.org/wiki/Discussion:Empreinte_carbone"
  },
  {
    name: "Diesel",
    unit: "l",
    kwh: 10.74,
    co2: 2899,
    meca: 0.40,
    source: "Wikipedia",
    srcLink: "https://fr.wikipedia.org/wiki/Discussion:Empreinte_carbone"
  },
  {
    name: "Charbon",
    unit: "kg",
    kwh: 8.1,
    co2: 356 * 8.1,
    meca: 0.45,
    source: "Wikipedia",
    srcLink: "http://www.verslautonomieenergetique.fr/detail-calcul-bilan-carbone-combustibles/"
  },
  // {
  //   name: "Ethereum",
  //   unit: "ETH",
  //   kwh: 33358127.8118005 / 1000 / 1000,
  //   meca: 0.45,
  //   co2: 356 * (33358127.8118005 / 1000 / 1000),
  //   source: "Web",
  //   srcLink: "http://www.cleancoins.io/#/info"
  // },

  // {
  //   name: "Bitcoin",
  //   unit: "BTC",
  //   kwh: 1074148224 / 1000 / 1000,
  //   meca: 0.45,
  //   co2: 356 * (1074148224 / 1000 / 1000),
  //   source: "Web",
  //   srcLink: "https://nomics.com/markets/btc-bitcoin/kwh-kwhcoin"
  // },
  {
    name: "Solaire",
    unit: "m2",
    kwh: 1500 / 10 / 8760,
    meca: 1
  },

  {
    name: "Gaz Propane",
    unit: "Kg",
    kwh: 13.8,
    meca: 0.40,
    source: "Pouvoir calorifique des combustibles"
  },
  {
    name: "Gaz Butane",
    unit: "Kg",
    kwh: 13.7,
    meca: 0.40,
    source: "Pouvoir calorifique des combustibles"
  }
]