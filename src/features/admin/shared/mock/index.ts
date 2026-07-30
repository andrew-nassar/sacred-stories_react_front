/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SacredStory, PortalUser } from '../types';

export const INITIAL_STORIES: SacredStory[] = [
  {
    id: 'st-nicholas',
    sacredName: 'Saint Nicholas of Myra',
    devotionalCategory: 'Bishop & Confessor',
    canonizationYear: 'Pre-Congregation',
    definingUtterance: 'The giver of every good and perfect gift has called upon us to mimic His generosity in the shadows of the world.',
    veneratedNarrative: 'Born in Patara to wealthy Christian parents, Nicholas dedicated his life and inheritance to secret acts of charity. As Bishop of Myra during the Diocletianic Persecution, he suffered imprisonment for the faith. His legendary rescue of three daughters from destitution established his renown as a protector of the vulnerable, laying the foundations for centuries of saintly veneration. His relics, later translated to Bari, Italy, remain a focal point of ecumenical pilgrimage and devotion.',
    accessControl: {
      publicArchive: true,
      liturgicalCalendarTag: 'December 6'
    },
    burialPlace: {
      sanctuaryName: 'Basilica di San Nicola',
      physicalAddress: 'Largo Abate Elia, 13, 70122 Bari BA, Italy',
      latitude: '41.1304',
      longitude: '16.8703',
      siteTypology: 'Major Pontifical Basilica',
      translationDate: 'May 9, 1087 AD',
      description: 'The crypt contains the original tomb of Saint Nicholas, which continues to exude "Manna", a sweet-smelling liquid venerated by pilgrims for its miraculous properties.'
    },
    chronology: [
      {
        id: 'ev-1',
        year: '270 AD',
        eventTitle: 'Birth in Patara',
        description: 'Born to devout Christian parents who left him a vast inheritance, which he used for covert acts of generosity.'
      },
      {
        id: 'ev-2',
        year: '300 AD',
        eventTitle: 'Bishop of Myra',
        description: 'Consecrated as the Bishop of Myra, known for his pastoral care and fierce defense of orthodox theology.'
      },
      {
        id: 'ev-3',
        year: '325 AD',
        eventTitle: 'First Council of Nicaea',
        description: 'Attended the historic council, defending the divinity of Christ against Arianism.'
      },
      {
        id: 'ev-4',
        year: '343 AD',
        eventTitle: 'Dormition',
        description: 'Entered eternal rest in Myra; his tomb quickly became a site of miraculous healing.'
      }
    ],
    gallery: [
      {
        id: 'gal-1',
        title: 'Ancient Mosaic Portrait',
        imageUrl: 'https://images.unsplash.com/photo-1548623917-2fbf0f6a5b3a?auto=format&fit=crop&q=80&w=400',
        category: 'Relic Art'
      },
      {
        id: 'gal-2',
        title: 'Relic Shrine in Bari',
        imageUrl: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=400',
        category: 'Sanctuary'
      },
      {
        id: 'gal-3',
        title: 'Gold Leaf Manuscript',
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400',
        category: 'Scripture'
      },
      {
        id: 'gal-4',
        title: 'Byzantine Iconographic Panel',
        imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=400',
        category: 'Iconography'
      }
    ],
    documentaryMedia: {
      title: 'The Legacy of Lycia',
      duration: '04:20',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    status: 'Published',
    submittedBy: 'Archivist Nikolaos',
    dateSubmitted: '2026-06-12',
    editorialComments: 'Fully corroborated by both Greek and Latin historical sources. Relics checked by scientific commission in Bari.',
    editorialChecks: {
      authenticityVerified: true,
      historicalCorroboration: true,
      accessPermissionsChecked: true,
      relicVenerationDocumented: true
    }
  },
  {
    id: 'st-perpetua',
    sacredName: 'Saint Vibia Perpetua',
    devotionalCategory: 'Early Christian Martyr',
    canonizationYear: 'Pre-Congregation',
    definingUtterance: 'Stand fast in the faith, and love one another, and be not offended at our sufferings.',
    veneratedNarrative: 'A young noblewoman of Carthage, Vibia Perpetua kept a diary recording her arrest, imprisonment, and visions leading up to her martyrdom in the arena. Her chronicle, completed by an eyewitness, represents one of the earliest extant texts written by a Christian woman. Alongside her slave Felicity, she refused to recant her faith, embodying courageous devotion that galvanized the early North African church and inspired generations of believers.',
    accessControl: {
      publicArchive: true,
      liturgicalCalendarTag: 'March 7'
    },
    burialPlace: {
      sanctuaryName: 'Basilica Major of Carthage',
      physicalAddress: 'Carthage Archaeological Site, Tunis, Tunisia',
      latitude: '36.8528',
      longitude: '10.3333',
      siteTypology: 'Ancient Basilica Ruins',
      translationDate: 'Unknown (Archaeological Site)',
      description: 'The historical basilica where the martyrs Vibia Perpetua and Felicity were buried. Today, the ruins stand as a silent testament to the ancient Christian heritage of Carthage.'
    },
    chronology: [
      {
        id: 'ev-p1',
        year: '181 AD',
        eventTitle: 'Noble Birth in Carthage',
        description: 'Born to a wealthy patrician family in Carthage, Roman North Africa.'
      },
      {
        id: 'ev-p2',
        year: '203 AD',
        eventTitle: 'Arrest & Imprisonment',
        description: 'Detained under the edict of Emperor Septimius Severus for refusing to sacrifice to the pagan gods.'
      },
      {
        id: 'ev-p3',
        year: '203 AD',
        eventTitle: 'The Martyr\'s Vision',
        description: 'Penned a series of mystical visions, including a golden ladder flanked by weapons leading to a beautiful garden.'
      },
      {
        id: 'ev-p4',
        year: '203 AD',
        eventTitle: 'Triumph in the Arena',
        description: 'Suffered martyrdom alongside Felicity and companions in the military amphitheater of Carthage.'
      }
    ],
    gallery: [
      {
        id: 'gal-p1',
        title: 'Carthage Amphitheater Ruins',
        imageUrl: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&q=80&w=400',
        category: 'Sanctuary'
      },
      {
        id: 'gal-p2',
        title: 'Early Martyr Portrait',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        category: 'Iconography'
      }
    ],
    documentaryMedia: {
      title: 'Chronicles of Carthage',
      duration: '06:15',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    status: 'Pending',
    submittedBy: 'Scribe Perpetua',
    dateSubmitted: '2026-07-20',
    editorialComments: 'Urgent review required. The biography text needs editorial polish. Cross-check Carthaginian municipal records.',
    editorialChecks: {
      authenticityVerified: true,
      historicalCorroboration: false,
      accessPermissionsChecked: true,
      relicVenerationDocumented: false
    }
  },
  {
    id: 'st-maxim',
    sacredName: 'Father Maxim of Altai',
    devotionalCategory: 'Missionary Priest',
    canonizationYear: '1904 AD',
    definingUtterance: 'In the silence of the mountains, the creator\'s voice is the loudest wind.',
    veneratedNarrative: 'A humble priest who traveled to the remote Altai mountains, establishing missions and translating liturgical texts into indigenous Siberian dialects. His life of simplicity, prayer, and deep respect for local cultures won the hearts of the Siberian peoples, establishing a legacy of enduring Orthodox presence in the East.',
    accessControl: {
      publicArchive: true,
      liturgicalCalendarTag: 'August 12'
    },
    burialPlace: {
      sanctuaryName: 'Altai Mountain Hermitage',
      physicalAddress: 'Altai Republic, Russian Federation',
      latitude: '50.9167',
      longitude: '86.9167',
      siteTypology: 'Wooden Hermitage Crypt',
      translationDate: 'August 12, 1912 AD',
      description: 'A remote wooden chapel in the heart of the Altai mountains where Father Maxim lived his final years in contemplation.'
    },
    chronology: [
      {
        id: 'ev-m1',
        year: '1845 AD',
        eventTitle: 'Ordination in St. Petersburg',
        description: 'Consecrated into the priesthood after brilliant theological studies.'
      },
      {
        id: 'ev-m2',
        year: '1850 AD',
        eventTitle: 'Journey East',
        description: 'Traveled thousands of miles by carriage and horse to the uncharted frontiers of Siberia.'
      },
      {
        id: 'ev-m3',
        year: '1872 AD',
        eventTitle: 'Sacred Translation',
        description: 'Completed the first comprehensive translation of the Liturgy of Saint John Chrysostom into the Altai tongue.'
      }
    ],
    gallery: [
      {
        id: 'gal-m1',
        title: 'Altai Mountain Range',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
        category: 'Sanctuary'
      }
    ],
    documentaryMedia: {
      title: 'Apostle of the Altai',
      duration: '10:45',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    status: 'Pending',
    submittedBy: 'Brother Elias',
    dateSubmitted: '2026-07-24',
    editorialComments: 'Lacks documented miracle reports for full verification. Historical records of the diocese are complete.',
    editorialChecks: {
      authenticityVerified: false,
      historicalCorroboration: true,
      accessPermissionsChecked: true,
      relicVenerationDocumented: false
    }
  },
  {
    id: 'st-teresa-silence',
    sacredName: 'Sister Teresa\'s Silence',
    devotionalCategory: 'Contemplative Nun',
    canonizationYear: 'Uncanonized (Local Cultus)',
    definingUtterance: 'To speak is to scatter; to remain silent is to gather.',
    veneratedNarrative: 'An cloistered nun who entered a vow of absolute silence for 40 years. Her letters, found posthumously, reveal a soul soaring in mystical union and carrying the spiritual burdens of the surrounding parish with profound prayer and sacrifice.',
    accessControl: {
      publicArchive: false,
      liturgicalCalendarTag: 'October 15'
    },
    burialPlace: {
      sanctuaryName: 'Carmelite Monastery of Avila',
      physicalAddress: 'Avila, Spain',
      latitude: '40.6566',
      longitude: '-4.7011',
      siteTypology: 'Monastic Crypt',
      translationDate: 'None',
      description: 'Buried in the simple, unmarked tomb in the convent garden, as was her wish.'
    },
    chronology: [
      {
        id: 'ev-t1',
        year: '1940 AD',
        eventTitle: 'Entering the Cloister',
        description: 'Fled her wealthy aristocratic family to embrace poverty and seclusion in Avila.'
      },
      {
        id: 'ev-t2',
        year: '1950 AD',
        eventTitle: 'Vow of Silence',
        description: 'Initiated the great silence, speaking only during liturgical responses and confession.'
      }
    ],
    gallery: [],
    documentaryMedia: {
      title: 'The Silent Flame',
      duration: '08:00',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    status: 'Pending',
    submittedBy: 'Lead Historian Anna',
    dateSubmitted: '2026-07-26',
    editorialComments: 'Requires bishop approval due to sensitive pastoral nature. Need to extract letters for publication permissions.',
    editorialChecks: {
      authenticityVerified: true,
      historicalCorroboration: true,
      accessPermissionsChecked: false,
      relicVenerationDocumented: true
    }
  },
  {
    id: 'st-scribe',
    sacredName: 'The Solitary Scribe',
    devotionalCategory: 'Desert Hermit',
    canonizationYear: 'Historical Traditional',
    definingUtterance: 'Ink on parchment is the sweat of the soul under the sun of grace.',
    veneratedNarrative: 'A mysterious scribe who lived in the Judean desert during the 5th century. He copied over two hundred biblical and liturgical scrolls in total solitude, leaving them in hermetically sealed jars for future generations.',
    accessControl: {
      publicArchive: true,
      liturgicalCalendarTag: 'None'
    },
    burialPlace: {
      sanctuaryName: 'Judean Wilderness Caves',
      physicalAddress: 'Near Qumran, West Bank',
      latitude: '31.7420',
      longitude: '35.4590',
      siteTypology: 'Natural Cave Shrine',
      translationDate: 'Lost to History',
      description: 'The cave where his desiccated remains were briefly found in the 19th century alongside his final incomplete copy of Isaiah.'
    },
    chronology: [
      {
        id: 'ev-s1',
        year: '450 AD',
        eventTitle: 'Departure to Wilderness',
        description: 'Left his clerical post in Jerusalem to seek absolute isolation.'
      }
    ],
    gallery: [],
    documentaryMedia: {
      title: 'The Judean Ink',
      duration: '03:10',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    status: 'Rejected',
    submittedBy: 'Scribe Perpetua',
    dateSubmitted: '2026-05-15',
    editorialComments: 'No verifiable relics exist and identity remains highly speculative. Historical records fail to establish the scribe\'s name or ordination.',
    editorialChecks: {
      authenticityVerified: false,
      historicalCorroboration: false,
      accessPermissionsChecked: true,
      relicVenerationDocumented: false
    }
  },
  {
    id: 'st-steppe-icons',
    sacredName: 'Icons of the Steppe',
    devotionalCategory: 'Collective Martyrs',
    canonizationYear: '1998 AD',
    definingUtterance: 'The wooden panel burns, but the face of the holy remains etched in our fields.',
    veneratedNarrative: 'A collective group of village iconographers and parish priests who protected their ancient liturgical icons during historical religious purges. They buried the icons in zinc boxes beneath the wheat fields, maintaining clandestine prayer circles throughout decades of oppression.',
    accessControl: {
      publicArchive: true,
      liturgicalCalendarTag: 'May 22'
    },
    burialPlace: {
      sanctuaryName: 'Cathedral of the Assumption',
      physicalAddress: 'Steppe Region, Kazakhstan',
      latitude: '51.1694',
      longitude: '71.4491',
      siteTypology: 'Cathedral Altar Crypt',
      translationDate: 'May 22, 1999 AD',
      description: 'The recovered zinc boxes and the miraculously preserved icons are now housed behind the main altar.'
    },
    chronology: [
      {
        id: 'ev-st1',
        year: '1932 AD',
        eventTitle: 'Concealment in Zinc',
        description: 'Twelve villagers sealed their parish icons in ammunition boxes and buried them in deep loam fields.'
      },
      {
        id: 'ev-st2',
        year: '1991 AD',
        eventTitle: 'Unearthing the Sacred',
        description: 'The descendants of the survivors, guided by oral maps, unearthed the icons in pristine state.'
      }
    ],
    gallery: [
      {
        id: 'gal-st1',
        title: 'Zinc Altar Chest',
        imageUrl: 'https://images.unsplash.com/photo-1548623917-2fbf0f6a5b3a?auto=format&fit=crop&q=80&w=400',
        category: 'Relic Art'
      }
    ],
    documentaryMedia: {
      title: 'Miracles in the Mud',
      duration: '05:40',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    status: 'Published',
    submittedBy: 'Lead Historian Anna',
    dateSubmitted: '2026-04-01',
    editorialComments: 'Extraordinary archaeological documentation. Fully approved with high praise.',
    editorialChecks: {
      authenticityVerified: true,
      historicalCorroboration: true,
      accessPermissionsChecked: true,
      relicVenerationDocumented: true
    }
  }
];

export const INITIAL_USERS: PortalUser[] = [
  {
    id: 'usr-1',
    name: 'Nikolaos of Myra',
    email: 'n.myra@sacredstories.org',
    role: 'Archivist',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    verified: true,
    joinDate: '2024-01-10',
    permissions: ['Create Entry', 'Edit Entry', 'Review Queue', 'Manage Users', 'Access Settings']
  },
  {
    id: 'usr-2',
    name: 'Scribe Perpetua',
    email: 'vibia.p@sacredstories.org',
    role: 'Senior Scribe',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    verified: true,
    joinDate: '2024-03-15',
    permissions: ['Create Entry', 'Edit Entry', 'Publish Own Drafts']
  },
  {
    id: 'usr-3',
    name: 'Brother Elias',
    email: 'elias.chapel@sacredstories.org',
    role: 'Contributor',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    verified: false,
    joinDate: '2025-06-01',
    permissions: ['Create Entry', 'Save Drafts']
  },
  {
    id: 'usr-4',
    name: 'Lead Historian Anna',
    email: 'a.comnena@sacredstories.org',
    role: 'Chief Editor',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    verified: true,
    joinDate: '2024-02-20',
    permissions: ['Create Entry', 'Edit Entry', 'Review Queue', 'Approve Entry', 'Reject Entry']
  },
  {
    id: 'usr-5',
    name: 'John Damascene',
    email: 'john.d@sacredstories.org',
    role: 'Iconographer',
    status: 'Inactive',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    verified: true,
    joinDate: '2024-05-11',
    permissions: ['Upload Assets', 'Edit Metadata']
  }
];
