import { useState, useRef } from "react";

const SWELL_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKsAAABKCAYAAADE8KQ+AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAA8TElEQVR42u2dd5xdVbn+v2ut3U6ZOdMnvSek0UVAOipiA6QoYhc7CtjrFUUvNq4XUcEOiKBeEUQQuPRi6BAIJaEkAdInmUw/5+yy1vv7Y5+ZJFL9Wa5g1ueTD5OTOYe993rOWu963+d5XiUibB//+uPRJ9bKxk19bOjZzPqNfWzqq9E/MMTwSJ1qPaYWxySSIdahFChAK4XxAopRSEtTRGtrhfbWMl0dFSZ0tTOus40dpk9UL5Zn4G2Hwb/OWNWzWZ5cs47HV6xm6aNP8vjytaxZt5FNfUP0DYwwXE1IUgeOHI1KgTagdP4BokAJiICz4BzgQBxYB1qDMuAX0L6mpeQxvqNZpk/sZN7sbhbOm83CebPYbeGsf0kAq+0r6//N2NDbLw8+vpolDz7KPUseYekjT7BufR+b+xLiWj0HmPbAN6gIPN8HrXEiOAuSOMiyLWBUgKcwvodnPALPYJRCaUEk/zXnIE0z6lmCpBYyB5mF1ObgNgqvUmDqpG722GUerz5gd/bZc2d2mNKttoP132g8uWGz3H3fUu5avJT7H3yUhx99kjU9g9h6AqLBD9BBgB8YPM8g4kiyOlktg5oGLHiO5qYCne3NjJ/YxsQJXUyY0EVXZwddbc10NkdUmsoUCwXKpSKeMWilEAERwVpLtVanb3CIvsERevurrOnpZfXaDTy1qodVq9exel0PI5v6YaQGvkdx0jj23WMhR7/uAF538MuZ2N2qtoP1JThuXfKo3Ljobm5cdC/3P/QEPes3Qka+DReKRL5BGw9RYJ1QTxJIYojrgKO5uYnpU7vZaf4kdttpPnNmT2HKpHEsnDn1HwaYpcvXyKOPP8U9DzzGonuXcvf9DzO4ZgNY6Jg5mXcecQDHv+MI5s+cpLaD9UU+rr7lbrn6xju5ftE9PPDoarKRFDwfE/n4foBSOo81lcFaIanXoD4MCJX2FhbOnsyeuy9kz912YJd5M5kzY9L/6Ra8/Kl1ctOdS7j86lu55qbFDK/YQDSpnXcfdwgnHn8k82ZMUdvB+iIa1/35Hrnk6kVcdctilq9YC3ULYQEvjAg1KEnJtIDWZM6RVesQp1AuMGfqOPbbfQcO2Xd39txtAVMnj/uXPZ2vXLVOLrr0Zn78m8tYfs9SwvEdfP7Ed3LKyW9T28H6LzzuXbZcLvrj9Vx2zV08/MhyXJxBsUIQhWgsVhROGQz5ASetp1AdICgadp0/jVcfuDevPXhPXvGyhX/TRG8aHJFavU69VieJU6wVRASt8iSB8TR+EBCGIYVCREdT6e8CrB+dd5mc/tM/sPyuZSzceyd+8F8f44Dd56vtYP0XGr/6wzVy/iU3c9PtDxL3V6EQ4UchRpEft12Wn8C1Rz3NYGQYPMXC2ZM49JV7c8Sh+7HPXzGpS5atkCc39LNqzVrWrNvEqjU99GzsZ2AwZWBwmJFajThOqCUJsRWsc3nqSik0QojgeYYwDAnDiHI5or3Vo7O9jYnjupg6eTwzpk9m2qQ2dpkz868G21fOvEBO+6/zSeMhvn3aZ/j0ew9X28H6fziWrVgtF/z+Ci68fBErHl8PKsIrRRjtUC7DOkBplFE4J/k2n9ToHt/K6175Ct56xCt59X67POckrt3UJ0sfWcmDjzzFsuVPsXT5alau6qGnd5B6rQZWwGnQPmgFOsvzplqDNmidg1MphQJGZ9U5QRCca+RerUCmwaZgLWjA9ygVIyZ0t7LDzPHstGAGu+44h90WzGLGpOdPWy1+5HH58Kd+yB1X3s3xJx/Bz07/pNoO1n/2Yenme+Sc31zJlbcsZqBvGKICUeCjRLDO5vlLrdDaJ61nuOF+TCng5bvN47jDD+CNB+/J1EnPHIMuXblG7ntwObfdcT+LH1zO46s2sn7TQJ77VAo8g/Z9PM+gtZefyZRibL7EIc6xZfYEnjaVgpO8opUnYvPPyBEKSukxYFsnpFkGaZaD2GjaWgrMmd7N/i+fz8H77s5r9t/jOUF48ld/It/76tm84e2Hc9kvv6K2g/WfMP5w5SI58/xLuXHRYiRTeE0VfOOhU4cVh1UWZSyiFGmiYaif9vYmDjtkP9517Os5YK95T5uo9Zs2y52LH+bGOx7glrsfZtnjaxjuq+bgDCJUFOH7Pp52OcxEEHGIE4Snz7tS8Pxzl3/GM7+evzfHcV7ZUkqN/QFFmipsUoN6FeUbpk/p4pX7zOeo1x/Eaw54ZuB+5+eXymc+9A2O+cBR/M8PP622g/UfFY9eeo2cfd7l3HrHUlCaoKmCRiEuRcTmC5cOEG3IRqpQrzJlehdvP/Ig3nH0a5g7Y/I2k3PfI0/Kojsf5Lqb7+W2xY+wfl0PZAJhAT+M0IFDNQDlxKIEwH+GK9N/9b08+7wK0NgVxoCvAbPNF6GBDrRSKGVwVojjFOox+Bm7L5jIsYe/kmMOfzVTx3dtc9/f+9XFcvJ7TuOkU07kjC+9U20H699xnPObK+Ss8y7h7iUrwS8SFgtoacSiokBZlBZQHvFwDdIaOy+YwfuOewNHH3Yg4zpaxibkz3cvk2v+fA/X3Hw7S5Y9yUhfHXQAUZEg8NDKIZIhTkDMluhSFEoJstXKumWStt7CR39dPc+a2ngvOV9ACcjoitpYsUd/c+vPRalGLljQDRKCk8YSrEAbjRNDMlyDWp3xEzs47DV78cF3vold52/JuX7xm+fKaV/+Ib++5HSOff0BajtY/8Zx0Z9ulu+efQG33bUcwiaiUgklMU5iMnwUYJRCa0WtOgz1hJ0WTuOjxx/F+9/6urEJWPrYSrn82tu55Kq7uGvxCrJaCgUfrynMt+s0xZMMUQpRCqfGFq681ArI6OrZOMXncGsgRECJQ+c/5uVTBaLz30QUii0HLGjEs84hKBwq5xloH6VNg/zS+AJog9IKEYtygrgMJAWxOT0BQSvB4HLgi0+mpAFqSxzXcMNVSs3NvPuYg/jUh9/MtIl5nH7wsZ+U++9czkN3nMO4zr+9TPtvCdbrFi2Wb5xxHtf9+QHwIsJyESVubKtXIhgsmReR1BKoDjJ3/nQ+8YFjtgHpub+7Wi6+8lZuunMJg73DEEQUCxGJS8hGBiFz6FITTaUKtbiab+hKja16orbZt3EoRHkYLFpcDmClUVicgIhCdF6iVQqc5Mwq3YhqsyzP7yovxAQROojQUYQJiqigCH4EpoDVEYhFw1ZAtSinEJthkypJWiWL61CvQjwCaT0vA9sk/5YpAeNhfIUfBtg0IB0YYPy4gI996Gg+/6G3qo29QzJhwWG8771HcPZpJ20H618z7l+6Ur7+/V/zxytvJEk1QXMrIhZsFZRGMCg0ntFkcUw6PMTs2RM56YNv5oR3HKYA7l2yTM79nyu59Lp7eGpVH6iIoFQgkQSGhiCpUeloYpdd5jF71jQkcyx56BGWPLaWbR+1Qmn9FzFmvvWqRpxqyVlWgkChGb/QhFGWrF5FEotvM3AZsatjjaLYPp5iSxc2aMEFFZyJQAvOOZwTHIB16DQhyyxKHEbyjEE9iSFOwGX4oaG9EtHZFNDRUqKpaPCUQ6V10sHNDAwMMzQ0wubNffT3DdI/OJIfFMMS6AhsnZfvNYVffPOTXHHLg3zxqz9g5a0XMnFSp9oO1hcwvvRf58kZP7uIkYE6heY2ADKXAg4lGofGGA+Do7p5M+XOVr780aP59IffogAuu/ZW+eE5l3PzbfdTqwteuQ2lDenIZkj66R7fzKsO2Is3HHIgE7rbWLJsJX+86nbufXAl/SN1PM9sFU2qRhpq2xhTNTbtTAwWD2UC/EIZv9KNF4TEQ/3YwQ2YbBiH4KzCmQJNE6fQPWcuUqwwODhCvZbmq7ADlwqSJSiX4rIMl9XQrg5eSJpBOjKM1sLcSa3sseNEXr5wIjvO6mbquDamtLU8L7geW7lOlq98ivsfXsbdDz7GPUueYPXqAdIBi9ep+NIJb+WMn/+Bj73/SE496bjtYH2u8bsrbpJTvnMuSx9ehVdpxTdg7Wj81eCDqgCMIR7sBxnh/ccdxmlf+jAdLU3qF7++Ur5/3mXc9/BToDxMoYKN6xD30tlRYp99XsY7jn4VR75yb/XU2o1ywUXX8Mvf38CyR1aACdDNRYxn0JatjzyNmFFttc6CQ0jR4JXxSu14pRb8MMTFVWqb16HjIbTLyJyDphbKEyfTNnUOxZZx9PWP0L95EHEpnhK0OGyaoDOLS2JsUkfZBGUUNULs8CDtbT6ve8U8jnn1jrxxj9l/t1P7lTfeKdfcsITfX30jTy1bAZ7H7vvswt1/OHM7WJ/5G79GvvLdc7nwkmvAK1MslHBZnBNK8FBOo1WGMUI1sTDQxz77LOC0L3+U/XffUZ3589/Kmb+8nOXLN0NUJDSKeGSEIHK8fOeZHHv4wZzwziMVwK13L5Mfn38pF11zB9WBOpSbicIiWIdzNbRyKMmpgI5GvKcUWhlMI05OxUOCMmFzJ7pYwZoQnBAPbkL1P0Wo6lhnyQptlKbMpWXGHModHYxUYzY9tR7ilMAYUJCmKS5LUFmKS2rENsG3KZ5vGB6ytIYx7zxsDz581D7sMKn9H1rP/8XFt8j5F1zEPXffyY2XnctuO+2gtoN16zzfORfLqd89l829VaKWCuIczllAo8UHneQHYnyqPQO0jSvxnS+9lzccchAX/M/VfPunF7J+TT+6uSNPylf7mTChlcMO2Z+3H3Ug++y+QAFcc/M98u3vn8e1tzwAuoRXKRH6mszmByZFQ2Ii+SZvUSjjoZTJ8/DkJdBM+5jKBILWCShdILYpWmLSTauRoc34OFLJKHRPoH3ByzDdEzFRQK2/Su/qHjzrMDqfxzTNcGmCzmJsbQCxDghROqXW38/Be83k2x99HbvP+edqr6656XaZOG4c83eYth2sAPcvWymf+trZXHvDfVCqEHkOa9OttlvBoPF0SHWkirNV3nbs6/j4u1/P3Q+t4ts//DUrHluNKjfnB57aIPN3mMS73nwox77pYKaMzw8IV91wl3z9Bxey6I4HgICwpYwohXKgbJ5GQsegBOcCMjE4T4iCECMGGiFBQkYaVAjbJxGUWslEECf4rkZt45Ookc14zlL3CrTNnEfLrHl4lRaU5xEP1diwrgdt8+yFxuKSFJtlYFNsbQTnMlAOP1GMjIzwmffuw7c+eIh6sc7vSwas//Wz38vXz/gl/YOWqKmCpHUc2dhJWymF0opMCW7TAPPnz+bEE96CF2Sc+aOLWbJ4Obq5gjiL1BN223ki7zvujXz47VtYRDfe9YCcefZv+OP/3oXVAX5LK9oq4nQIPzBo8VDOoJXFaosFHBF+1IofREgyhEuroB2pA13qImifQhI0YZ3C146AmPr6FchQD8pZdKHEuJ32xB8/FWlqwxiFTmI2PLWeLHFoyWPvLI2RJEG7jLQ2ApLhi0FEU62v4/QT38jHj95XvZjn+EWvbn3kqfXykc+czvU33ktQaaNQLmHTGpCMlRBzoGqSkTqeaI7/wBHs+4qd+OV5l3LddUugpQ2ay7hqzD67z+LkD7yeo9+wZQVatmKV/OcZv+LCy27FJSlhpZXI9xgZ2IxBmDJpChs3bcZqEONw4rCugCm2EjW3IFjS/k3gEpQ2JE7jt3QTtM/IeSs2w0PhKUXauxYZ2oiyKdLUzoQ9DsC0duGXi2AcoTIMDg4R11ICL0A5waUWl2RoFFlcQ7sEhQYD1cF+vvnRFz9QX/RgPf+S6+TTX/0+GzaOUGjvQBqpGYcgyqCc5NUaIB0YZPb0SRx71CGs3dDDBz9yGvXUg7YuqPaz246z+NQH3sRbj3zVNpN66n//Ss74xe/p2xwTlZrwCpqaZMRrV7Fg4Sxe94ZDuOrqO1m3fjNeaLCSYL0ifvMk/GIH1o1QG9hEIFUCZam6CL91BlHHJGpK41FHOYfWkPVvJOtdh3aCKlWYvMd+2NbxeOUIL1BkacqCCWVuXjmCNh4aEHFkSYwShbV1VJqi0SjfMdRX5T2HL+TTx774gfqiButHPv9dOfvcP0GhibC5GZvFeWyq8hhOCWgMaZKiJWHfV+zKrJmTueD3f2LFkz0ExQrU+5hYyTjpc+/j08cfs82EXnrdbXLq6edw7+In0E1NRC0hIo7hwRil+vn0icdy4AH787mvncEDj60lLLeTZoIXVfDbpmC9AjVbRwZ7CJI6WoVYWyVo6cLrmkoiCk2G0gqrAiQZxG56Am3rZFGFGXvsh2vuIIgMfqCoJilzO0Pa9DC9vYNE5VZwGZmNcY1Qx8V1fBwQUKsNsvO0Zr59wutfMmeSFx1Y73zwUfnIJ/+bexY/SqGtm8xZJIsbpcstpAyFxqVCexSw2267sWmwj3N/exnabwHtU/ZiPnjyW/nY+97M+M7KGFAfWblWvvytc/mfK/+M0j7ltnZEhCSLSQd72X33HfnhV05l3Lhu9jniJNZsGKDc2ko1Bd3UhWobT0qIlw6jBjegs3oejGQxttxFoXsGsQie2DzNpEJ85Ug3r0fFgyTaY8pOu6HaJyK+RxgaEuXhbMzbdqlw/jWPEusiBeVwImRZilYKm9UwmSP1MoQC3pDmCx8+mI5yQW0H6//B+NmFV8pnTj2LvhFH2NFFmiVoSVHKIo34dPTA6MTilz2aO7q4675H2DwSg2rGxX0ccejenPLJ49ll7vRtJvLHv/mTnHL6+WxYPULY2oQSsAi1kRE8D774qXfy9U++W23YPCwvO/SDrNlcpdDaSTVzeM3teK0TiClgnMPVR/CSYZQSnIDzQsKu6cReCWyGQmHFobRC1waRoU2IFVpmzKFpykwGtE+pXASVkiQJu4wL2HdmF189dzFBoYRSKVmWoZzDANamOZFaeyTDwxy0cBJv3m/nlwxQX1Rg/fCXvi8/+vnFeKVWorLBpjW0EgSNiAbVoNY1ElVaK7Q2PLF2Ey4VqA8yf8FU/vMzJ3PEoftvM4kPrlgtnz31HK64+l5UOSDsCFBJgjMeydAAO8+dzOlfPYlXvWInBfCm93+R1RtiCi2t2CRDN3WgWsaTKQ/fJZh0kHqtjyAXZmGtw2udjCu241ya5021j0MT4LADa5BsCNXcRfv8vag5TbHo42uNmADqI7x1twmMxMLGYSEMNCIKa21OaMnSPJdsHB4F0mQzRx82/yWXP/+XB+ujT26Q9518Grfc/iBRWxfOpkiWoYUG18jktDmVYZzGE41VgiiHZIIdqRMFwsmfOo5vfPp9T1tpzjr/T/If3zmHzZsHKbR1kziQzKLFktQ1+x5yEJf890l0NBcVwAdP+4XcdvsjVDo6GU5T/GILuqmTVEdoByEx6fBGtKR5nlWAsAmvZSKpbPXARWGUwtpB7MgmFJquBS9DNbcjNqYQ+oAjEY9xTR7H7DJV3fRYr6QCoXG4TDVM2BTWZrkiQGnSVDG+s8Ahe83eDtZ/5vjfm+6R4z/xDdasH6DU1kWWpjldDr0VnT2P/RAfVIYjwZiI1HpUN/fwsj124PSvnswBeyzYBqgrV/fIJ075Pn+44na8coVipZ3EZhixqHqVpNLFLvu9gh9/9d10NAcK4LbFS+UX515B2DaeJK2iC824cifaK6JF4yG4NMWmMUYpjFgSUXjN3UhQxLgMpXJCnxGLQpHWhrC1KsX28bTOnkuNlKgYNbRdDptlzBtXAKBezwsNeCq/7dHKmDgUDqMM9aTGnPmtzOpsVdvB+k8aZ5x3qXz2qz8l04pCpZUkzXIa8TMUMbRTKDFYz6ECRdzfT8FEfP7Tx3PqZ971tEm76Kqb5eOn/IDVq/PVVGyVutN4UsfVa5SnLWDCHnvxrY+8kvntwdj7v3D6eWSZJYwc1i9gSm1g/HyFF4dRlqQ21GBTOayA1QFRuQUnMlZJU4BVoFWGGhzAZdAyfQY2DCCOMYHfkNAYcAlzJ+QssVAJntEIPkg6qrjGiaBFMMpCMsIO0+byUhz/kmA94bPfl7MuuBTdUsGIR5rmRGHEPYN4ToHKMH4MtkDcM8A+r5jHd079KHvvNPdpQD3hKz+Qs8+9FIIKxZY2XFojNSFaYrIspmPXA6nM35ePv2ESh0zfQpG75Pr75cZbH6FQaSHLHF5zG4kqYEzY4NALKqth45Gc6S+SgyhqQsJyHkuPqlNFclmKTZGRAUyhRGnSdOpO8DwfpbdoBTSOqZVcl9XeXKAYGKqiGtoolXNd88pH/oWQlEldzdvB+o8em/qG5D0nf4PLr7yXQmcn1tZwkjPhtROc0jilGsK6seAP7QdUq0ME0svnTzqO0774/qeB9MEVa+QDn/4mty16iKitGxGwadwATQakdOz5Bsoz5/GauSHv23tbD6efXXw1Cg8j4ArNWK+E0QZ0iHV5HGnTGmLrKK3A5fGqV2xCvAJk6Vg1bfS/WjLqtUEKE8ZhmtpQieAVDNoYnLO5AkpBRzGfpvHtZToqRVYNOYzRaK0RpxpWrQqrcrfBUuRvB+s/cixdsVbe9sFTWfzwcqLuDrIkxXMG0UnjPKLzPKpolIDTuZ+owVDv6WfOvCn84Nsn8uq9n24mcc7vr5ZPf+0sevsthY5ubJrlK5xunKj9Mh07H0Rp9i60mH4++dodt3n//U+uk9sWLaZQjkiVQYdFUgHfC2j4WwCCTWOUs7msmVyW4oVNWPkLdWpD16XFYW1M2N5NZkJUkjRYWXk2wwFawG8oCjpKgZrVXZIVfX1Evt9Qn+aeFw5DQAZ4OPvSpH3qf4WLuHbRffLKI09k8aNrKbR2YpMURHJhmjTEHmr09O9ApWgTksUQb+7hnW97JTddesYzAvUjnz9D3nvid+kf8YlKxZyVhAXtyKwjamqlbf6eRHP2IBnZyDv3m8q01rZtPueWP99D3+Y6yvexfiGn92nBGj8Hlsr/LtYyqslX4lDKQ2kPJZIz+5Fc6Nd4T64wFQqVThwaURalQcjNgU1DTZC5MeY2L5/RTOYc2vNRnkZwaK1xWpFHuj7DtWT7yvqPGL+74mZ574mnMZyWiEpFsjTJYzrnUEq2WJA3tnxRoP2AuH+IrpYi3/72f/Cuo59Oe3t05Rp57ydOZ9Gfl1DomIATl/M8dYbGUc8UQftUCrMWUpwwCUWdKd0Vjtpz1tOu8Z7FD4ExiDL4foBzoD3d0NuPcv8VztqxnxtsVZRpSKGf9qkq5y9oTRjlpdzcdUVvs5LUEXpG0rHXDtypm/IVq4lRqDAiyxK0Z1BpgsUDz+Ox1Zu2r6x/7/HDcy6X447/DjWaMCUhTZMxXbtWjYsTnU++CMYoPKWJN/Sxzx5Tue6P331GoF5y9SI5+PCTWHT3o0Td3aSujnM1lEqxAnVrKHRNo2nGQlxlHEFHF1la49CdxzOx4D/t81Y+sQF8H8FDlEEkFz43Krz5IWebLMWox3/jMLXVv43SFR0gno8yPtp4uEapWKPyjIdrvBfD2uEtrip7TO1Se04tUq+NEBYinPJQJsRoQ6Y0nh+wbFXfdrD+PceXv3u+fPTz34bmCOUJKo0bBBQ3uk6xtQGE5/vU6zH12jCfOfnN/PkPP1LP5AB96pkXyDHvO4W1Q0JUbsYmCUpyErJDkTmh0D2T8ozdif0mOtubwVnKkc+hC7qe8VpH6g60j2gPUV5D46/HVvvRspnSeittlULIyd9KbZW2GrPnAe376CBAGjGpjAFbjX20pwxP9la3uZ73vGYWno0JjSHwCqBCtAmwKKKwwGOrhliycoNsB+vfYZz4xe/L1047l6C1DdE1xMZoFzRWUN2Qpet8VVUK5fvUejczpb3IJed8g2996UNPA+mGvmE55v1fk1O+fgG62IVfUNg0QzuHFkE5TZoZonHzqEzbkaHMUGprJyxF1JOMmR1FXjah8oyJ9CRNQTmMNo3NvWEr2bCjUJK7q4jSaCyj6NXikDTJZd5KUFqNufyBQoyH55exqR2LT3HSyHbkYA+Mx8M9g2yK4zHwvWnXiWrv2Z2MpJaguYxVYa6/EodnNIODwp9ueXj7yvq3juNO+Lp8/ye/I+pohUyjUg8lBjdaIlUZogSnQHkGHCS9Pbz20L24+bKzOOKVuz8NUHfcv0xe9aaPcNEfbyDqaM3teTKHaItSKQohc4rSuOkUJ+/IsFV4oaa5rYkahkQU09qCZ73mKPTAubGtX5EbYjAKS3G554AX5IcjHKIUWixZdQjt8th7zPgMyQ9dxuCVOolrCV5j1XUWHAqnFBbwPcPqoYT7Vw9sc02fP2o+vkrQxlAMU/AiPO3hJMUrlPmf6x/aDta/Zbz+3V+UX//2JqKurryevY1Ho2DIdfxWCyow1KsDBDLMd049gSvO+4aaOqHraUD95R+ulUPf9kkeXL6RQkcbqR0BZ3N5ieT2kbEzhONmEU1eQOwy6i4jqjQhnkEkQ9uYSlPhWa976qSJkOZPS2h4QTmbGwc3rsghmKCAqABwjZSWIasNYZIqHh5adJ45UILSgsocplQhrScokVzr3/gS0FhdjXLYLOLq5Ru2uaZ9ZnSoE145herwMMWmCGtKmKBMqsEvaB58YpCf/Ol+2Q7Wv3Ks7e2XfY84Wa646jb8cRXSxAPR25qPocAFGBVhMMQ969l1/nSuvfh7fOqDxzzj9vyZr/5A3vWhbzBQbyEotZKkNp9s2VKWraeawoRZlKYuoKYjRGlMEFCqNI8VHCRLCb1nT4zMnzMpN9/VaiyGBou4NN+yleCUoIIC4kWj9aw8fk2quGouf8G5PMSVvJKlHFBqIU4sktbQxiB/kSO1khEFBW5dMcATAyPb/ON/HLGL2n9hG31xRHMlQIcRBEF+WIvaOOPCW1k3WJPtYH2BY9kTa+TQt3ycRbc9QNjahUssmvoYpW/Lupo3JovjGslQLyd++Gjuveonaq+dn+51unp9r7z2HZ+W7/zwdwSVdkJVw9oqONDWR6MRlZCmMS3TFlCYvit1HRIo0EpTKJcJgiD3e2qczu1zCCdfsedCTOCwzo6ZmmklOJciLs8GWBHE+HhBodFELX+0Phn1/g3gUnQjb4yYXGcriswUyQTqtSraeFhrybJszPEvRQhI6RsIufDBDU+7tu+962XMbU+xkhGWCphCM57yiIoBS3tG+Pp5f96+sr6Qcf9jq+T1x36cBx5aS9TWlOc5nUapNJcuq/yIYpTCmIBqXy/Txvn8/hdf53unnvyMq+n1dy6RA990Ildduxi/fTwiCU5qKCyey0/kWtVJkoQFe+1Py/T51G2UH3hUAjiiKMhNzUTyVVAHDPYPPOt9HLL3TmrezPHE1RhlUnILNQ9xcb7CYlBOgyj8QrnhYSVYpVHaYOuDpEMbMBqsyg9lWgRLnqYDw1D/CHmx1JHEcR7n5gsxDksQFrnsvj4e6q1u862a1RqpH39oTyLPUhOoRGGupBVHsa2DX131EL+5YalsB+tzjBtuvV8OPeokVqytE1WayVIBbUFnCB6mkaIyfkCaOeLNG3nrkQey6PKfceSh+z0jUL93zqXyuuM+y/L1g0QtrUhaQzmFFh/fKlLfQyuhPphw9FsOJ5o4m40DdQx5RsCRW/CHYTAWL4sTPOPx5MbB57yf9xz9alxtpCFA1CCCthk2q6Ib+VFxCgmboFDBNUwurFJoLPHGJyEZybf2BgSdEoykaB0w3Fclq9VAaVySIQ3yjnGKTBQYy0DV8OPrH3vate06tVOdf9I+TAhH6HMFguZWTFAgsBZbbOHjZ13FjQ+tke1gfYZx0VU3yxHv/izr+1MKxRI2y7apzICglQYTUBvoo6Oi+OkPPseFZ/+HmtD5zHY27/vCmXLyF36I0xWiKGqUTUcd8TUKhTIZcd8mPvSh4wgnzOaBFX34xSJO1RHlwAUopfADH93IbToRSsaydLPw8KbBZ53QTxx/mJqzQxvxgIdWBYQE5RQqGUElw/jKIVqT6AiaJ+JMhB4NM7RGZ1WqPU8SuSqIkOIxGhUorXA2o69nU8MVFur1Os7ZXAiIw7mUsGC4eXk/P73zyadd576zu9WvP/UqJlccfXFKc6WA80qICtiUNfGer17EXY+tle1g3Wr8/LfXyNs+8DWGbAGv6JPafrbQpBq2jp5HLROSgU0c9vpXsOiPP+J9b3nNM4L0/qVPyd6HnSA/P+dSvPZWRCcNoG4ZziiyMMKu7eGLn3kbs162Exdcv4agqTs3PxmVvEheIlUNj9RR73xPK3pjzY3Lep/z3k454S1Q7UErO5oCQLsUl4ygaQj3MEjYRNjcSYKXE3Ccw8ORDm6gtvFJIpVt8Yhp9AYwSjO0uZ9q/yC+MVhrSeoJRkb5EXknGFtq5+xb1nDt409P+u8yvVNd/tn92XfcMD1DVfxKE0VlMbrEEzWPY75wETc88JRsByvw1TPOk/d/8luosJnAhJA5RJmxFVBrA8oQb+plYpvm3B9+gUt/eqqaNeWZO5qc87ur5YAjT+T2+1YQtXVCkqBsnocdyyKonBmSbFrH6d86iUOOOIpTfnk3TZUmlNTzPIMz4ARRWc4RcFsf7hSp8il5cNm9a547R3zo3up9b9+Tkd41GNOUf/k0iLMk1WG0sjkBWjJMUzu6eTyp5I7UqfLwlSPpXUPcu5pQ5cwv1yC5aBS+Mmxa30OWpBjPkKQJWRzjKU1KgIjCl4y6KfGVyx7lzlX9TwPerHEVdf2336bevs8E6gMbkKZmmkJLISizphby1s/9hnP/d8mLErB/N/ugD3/hDPnRTy8j6KhAnj3K40Ll8AXED6iPDIPUeedRr+Frn3k/UyY8u4PdCaecKWf99ApUsUjge7hstEFETsDWgPPApQpb7eHMr5/Ex44/Wi382MWyYoOiUKiS2byNzii7SSlAHG2TxxNUSlhn8zS/KDxtGa7WOe3IHXj77pOfUxLy2g+eIVcteoKouxkb1xue/x6ERfxSM6IMVnm5PeXGFaj65jxOx6KUJhZDoXMyfvsUElE4NJ5yGCVk4vALId1TJ+F8gxNHFIbooIAWi5I8t1u1Pp1+ne8dOZPdJrU94/WeffWjctrvFzM8nCKmQlbrQUaGSOJhPnbU7nz3I69V/1Zg7emryvtP/k/+eMUioo4uyGJE8so+ymKMJo0FOzzIgp1mcNoXPsBhr9zrWR/S3Q88Lid89jvcec8j+G0dKMs27XGksaX72lBLh/HTkB9/58O85y2vVR858xr52Q2raW6tkCY298Xf6r1a5bFhuaudpu42MrEYFKpRPKg7zaxokPM+sj+TnkNv39NfkzedeAa3LllLsVLJsxxKkwqYqIAptpHqAAT8bIi4dxXEI5jcGB2lhVQUYce03JkFAzg85dCisc4SlCI6p+WAFesIwwA/CLCSe69ioGotnTLIqYfvxCtndTzj9T74VK988Vd3cMUDA/hGE6bDpNWMWn8ve8zr4LSPvJqDd5muXvJgXfzwCnnXx77BA0t7iFpKuKwfxEMkZ7vjLPFAH63dLZx4/FF85eR3POdD+eZZF8o3vvdbBqseUZPBZYOIRPAXBDsThNQHeulsjzjne6fy+gN3VZfctVKO+9btFEseGSlkISLxlpKDagQjzqGLIV1TJuAMYzIZI3nJMhkZ5I07t3PmMbs+57WuGRiRd33sbK67+3FKHe1YC07lLXu0X8AUK2TKQymFyaokm1cjcYynpEF9hNQqwtZxRF1TSEwRK+DlXSdIs4Sw5DN+8iR0VCC2GX7g40cBmeTpv4iYXlWhPevjiweO48jdZz3rNf/qhoflzD89zL2rYoyzFFzK4GBMi67xntfswInv2p+p7c3qJQnW3152g5zwme/TWx3Bay5jY/CsRoKc4pYODqCN5S1vejWnfOpd7DBl/LM+iPsefUI+++WfcfX1d6JbihAYSITAapzOtrTJUeCZgOrGAXbceTK/PPsUdpmTb9n7ffy3smiToll5iNWIGs5VeVs1IlONSlmqHB0TxhFVSqTO5qGncojSKBOS1gf57KGT+NBes5538o769E/l4j/dRtA2AacNuCzfrr0QXWjC6SgnpGTD1Af7kLiKpzIQmzetEI0qtVPqmooKm7DONgyHwdkMPwxomzCecqWJmk3B0wRREZTBuDq+dmT4ZGmdNyws84kD59JdCp7xujdUUzn/qgf55dWP8uD6hIKBQMX09/Yzp1X40DEv5+NvPUC9pMD6mW/+XL7zg9+gCs0EvsJlMZ72EKepj4yArXPoQbvzuZPeyQF7PbcryDfO/q1868wLGOjPCFubsDZplEsb+UyV5rwBbbDOkfYP8aY37sOP/uuzdLWUFcBPrn1MPnrWbVSaA2rWw3MpVgFWxtpIosgNy1Qu5jaFkM4pE7C4nIiiDAabq5y9COI+vnbELI7Z6fnNb7981iXy9R9fiQQVCsUo90VtaMa8QhPOL+JQhC7FDW8mHtmc97xSGl8yEHBeiahtAl6lk0yBFYWHQTmHNUK5tUJzR1seFmAJowjnFwhdDbQQmxLp8BA7tDs+dvAcXjPn2ZtNbBisyYU3LePX1y7jgRUDOO1BMkgyFLPztFbef+QuvOWQnegoF9WLFqz3Pfy4fOJLP+CGRUsJ2jpBD6NsBM4jHukFGeaAvRZy8ofewRGHvOI5b/R/b7lXvvqdn3PbnY9gmlsxnpDaDO0MShRKOcj7laD8kPrwMEZiTv3cR/jCCdtyBQ780lVy2+P9tPiaGhYlCc5FNPhLY4ynPG7VKA2pOMqtFVo628kkRbSHIcPD5QQUZfDdCF97w1yO2GnC807axdffJ5/6zq9ZubpK0NJOoGo4G5PpAAkqaL8JZRq27NXNxAO9iHL4pHgKnPJJxcOUmim2tKOjJmKJQGl8aiTiMIUizW0dFJsLWJOhghJeGOKToMQipkiWZYR2kIPmtPH2vaaz2/im57z2n173sPzx5ke487F+Ng+nZLU6pHV2mtbMca+azdEH7cLMie3qRQXWs867Qr70jR/TN5gRtVdQEpOmimxoGHTG/nst4KPHH80xr93vOW/syfWb5Jv//St+8uvLcaIpNOfSZpxFi8JqR6PLDr7xcRqSzZuYPWsc3/vPj/PaA1++zeff/USfHPqlP2JNASeuwbBXYwcrRaNslUtA0Y3mwI2mkLR1dlBsbcK6LNdWqdEYN+euBskgJxwyi/fv/fyHkFWbBuVLZ1zE/1x1L3UJCcoVPIlRNsbpEIrNWC9EOwdxFakOkiZVjHZ4yjSKFBanPLxyG2HrOCQs57licQ0ijCMsFCm2txGVIpyn0AWfwPcxmLxPlhKy2hAVP+OQhd28ebeJzOt8btDe/USP/O/tK7nynqd4cEUfAwN1SFLaOkIO23Max+w/l9ftPUv9S4P1jiWPyX986ydcc+N9BOUOlBcRDw9CbZioOeSQA3fiw+98I4fuv+fz3sjpP/21fPesS1i3ukrYFqG0xmY2VwjgMDgydP7AtSIeHgbl+MDbDuU/P/s+OlqffgD49Y3L5N3fv5VSUzNZlo7VH0blIzQqRGMd9RpgHQ2CnTiaO9qotFXIxOayPq3zLRpLpkPscB9H7dLBt4/a5QVN1tV3LpWvn30Ft9yzBuV7NJcNcaPAq0xApgKUCQmAtD6ErQ3hSYPo0pDI2AZnwSu3oSvj8IIgLzo0JN5a+/jFCL8p/xMWIqIgRPkhohRGZWhnqceWcujYZ0aFo3fqZJ/pHc97DzcvWyOLFq/m5iVruO2xTQys6YV0iCnTOjlkr/m8ad+ZvG6vfz5wnxWs6zb0ypk/+x1n/+YaBoYF7fu4wX6QhFkzJ3L4oQfw1iMOZvedZj7vRZ9/8dVy5o8v4e77n4ByhBcpXJorArS4vDKhVF7tUYqkNgK1Ifbaaye+8ol38pq/WE23ySX+8W752DlLaKo0Y7MEJVvanI9JSEZTAYw2SlHbdPdz4qi0tdLc3kKmBXEJvrIMmxZCYgIy+qqwx0TDl984j10ntrygibrwskVy+gXXsXhZD/ghxUIhl5E7i1MGFxQIjMa4jLQ+RFIfQSF42LFnYkXhlIcpVvCaO9CFVsQPUDrL6YQOQt8nKIb4LSHFpmaCYjEnrivBakhTTVavU9Q15o5v4lWzujhoZguzupue9z6Wr+mVux5Zx80PreO2JStYtnwj9URobwvZf1aZ1+21A/vsuYB5U8epfzpYewaG5OcXXsX3f/4H1i1fD1EIvjChs8I+e8zj6Dfsx5vfcPALurCLrlokp3//N9xx31LwCwSFJnAxuJRM5+Roo0CbEIcmrg5DdYQ5cybyiQ8ewwffcfjz/n8u+vOj8vYz/kyx3DRWhh1tovtMYKXBJNi2jKdIxVJobaalqw2nJVewojBYwKCMTzWpUvDgA/tM4OMHznzBk/OLSxfJz353LXc8tA6nyoTFAE9lxJkDfPyggOcbMpeQ1UaQpJbH6rnmGy0WKxqrPExYJCg1YZqaCfwCTvlYq3OKowHPNwSFkLBcplAsERZDVAT4BktIXLPYZIjWIGXnySUOmNvFrpPb2bGj9ILuZ9Wmfnl01WbuXrqaOx9czWMr1yFZSndryA5TWth9wXRmTZvE+HFtzB7f9o9p4X7DrffL+Rdfw0WXXc/QhgHKE8azcO509tplBgftvSN77L6A8W0vzOzrV5dcL2ef9ztuvWs56DJhOUKIsTbBE43Gx3m5B0CaprhqDB7svmA87zr2TXzsXYe/4Jtc2VeTV33yN2yOI6wHWA/tBKsTtJhtHFBG41a2ytyKMBbHZuLwQp+mtja8SjOhxCSisMrgYXMtlYNarcZuEzw+ePAsXj+v+wVf6yU33S8/vegmbrj7ceqDMYQRflhoxMcW31OI9rBZSpbGeZM1wCkPrQXlHMrluVzrBfhhGRM1oYplTFhCS266YQVSUShPE4SKsFCgUC7R1BQRFXzSIKCGIs5SAkloCzTTKhE7Tiiy28QSc8eVmd5RecH3tXagKqs2bOap9b2s6xsiriaUXExT2aejrYX29ja62lqYNu5vA6+6Z8nDcsutd7Ls8acQFTJn7jx2nDeNmVPGM2Nixwv+8CdWbZDfX3EDF1xyE4sfWAFekaBUxmCxkjZYVwqXWtIkyZvXktHd3cJB++zO0YcfwlGv2fP/62b+4zd3ytd//Qjj2gwjqcHhE8gQDn+MBP2XYN32G7sVH8w6LI6otUxLRydeFJDaLDeTsILTHlorsngYY2P2nd3Oe/adzv4zX/izumPpU3LRFXdw6bV38NiT60EX0aUKoe/hSUqWtxrOdV82Qbs4N8hAN7gWgnYJoLFicF6uEvDCCC8oYIIiOghzRa7y84Ycuc0LJvDwQx8/8AlKEYWmMib0cdrinCHA0RQ5JlRCZrYVmdpWYGZHyJRKgXmd5X9anNozVJdHn1zPw8tXQlZj/53n/e3l1utvXSIX/P5qLr9hMT0bBqDgEZZKZNZhs3qjm7KDNNdXBYWQqVPGs+duO/Cq/ffgwL12ZeqEvz018oav/0muuquXclsJlw2hbBnUFo3UX4J1G0mNbBu/jhqeGd+j1Fqh0NyE8Q2py7tOC4pACxqhHlsiz7L37Gbesus4Dp07/q+6l99efZv84frF3HLPCtZsHAIXQhDg+R6+zju4OOfIMotzWU4axzV4BqrRZTs/KAoWpzUoH+MH+GERHbTgBQVUECKe38i05BwE26BX+qEhCn38QhN+VMQPfcQzOM/D00LBc5QjQ6Xs0V7x6Ch6TCgHjGuKaC97tBYCmstFip6m4Gm6Q62eG4gjUo8tg8MxA0MjbB4YZN3GYVat7eGRJ9ayZOlqetf3M3NyJ0e96WUcdegrmNHVrv5qsK7u2ST337eUq6+/g0uuv5NVy1aAU1BsBj8c88YJAkNLc4HOthamdLUye9ZkFs6fwsL5M9h7l/n/kG/oUV+5XC6+by3FSpnI+mSSbQHqFoLAs66so7p9rTRGK5wiJ2z7HlGpSNhcwguCBnVaMEowxiESkMYxETV2mFDiqJ0nctCCLiY2vXA//zWbBuTWe5fxv7cv4677H+GRJzYR1zV4RYgijOcTYDGujrUx1qnGWuswY0Vj3WhV3MgwO4dC0NpHTK6+1V6AMgHGD0CZhueXh1V+PndKoQMPP9CEoYcXRTnIvQDleXkWUOf8BkzOKAuNJvI1kXZ4YvGx+FmMTRJcFlMbHqQ+PILULHGcUk8y4iSjWncMxxY3PAzDudCzMGEch7xiR449fGeOffW2Sua/Gqy33r1YHlz6OAODdbQJKJSKYDSeFiJPE0UhTeUyrS3NdHd1MH1C5z81xfG5n14vZ125gtgLKUUhIA1K4OgSO2qdkdMWVQOssuWlRqpLN85l+fsy58A3FEsRUbmAFwUYk7cvstqB8QCPNM6zCRMrsP+sCq+Z182Bs//6Z7BoyeOy6L4V3H7fYzzw6ApWrRshrqlcqRAEeJ7JbYOU5N4IzoHkpWnX4L9KA8gNTQTiBCe28YpGlAcYtHYoFWPITTwyEyDa4ItqNPG0edFBVONgnHdT1A3CUqpMbhOPIJkD60CZBvUuJwnhKzCNB51aSBLILAQe47vL7LfzNF534Mt41T7zmdj2zOHGS7J367X3PiWn/fYWbn6sju8XiKICWlJELInyMC5DN6bS6fwnJQYjunEKz7dTtc1hbNQL1SE6FzdGpQJhUwkvKOaeqpJgdAZKURWfLLOUSJjW4vPyac3sP7ebV83q+KuBu2lkWB5b2cMDj63nrgee5L5lT/Hkuk1sGoqRWEA8MBp8izYGT4EnOT3TmlzIlXcibHiIiWvYGjW+n6KwzuRSowYeRDVAPppNGf0m69y0wzVI4doYlPIapXE/16MZkxvVAZm1ZGkKSZqDWFs6KiFzpo1nr11ncfBec9h14QwmVJ4/jfaSbuF+znUPyy+vXsodT9SIxaMcKEKtEWdxypE1/F4Dl6EailNB5ROl3Lbhw9apMGGMOI2vCQsRhVKRoBChAx80mEYhwooQxym2nqIDzaT2gD0nljhwVju7TGlicqX0/7XzrN7QK4891cPDT2zi8Sc3sHL1JlauH6Bn0wD9AyPU6xYyBzbOVzntg/Ly1IfJX8t3Do1WgtZ2q3i+sQM1yD+ylY2TE91Q3pLHSKM+X9Zu+SMadIRfMLSVAzpai8yePo5d509gx7nTmD9zEjtM+ut3m5c0WEfH5Xcsl3NveJSbHu5lYKiOCosEUYFIp3hZinUBTqV54wy8nNWtnyHe3Qq0Wz3A3JBYgTYaL/DxwpCoWMQvhGgv/0I4pTA2w6YJQxlgPCaVHbM7I3af0sxOkyvM7Cozvelv61u1rndA1m7qZ+3GQdas38T63kF6egfp6R2gt2+AgcEaw4MJ/UND1OOM1AqZzVt4OmsbJV1hm/ze2AqrMcpgjMb3DUHoEQUhxSCipVKkraXIxPGdTJ7YwrTJ3cyY0snkzlZm/p3yrf8WYB0dS1Ztlktvf4Sr71rBg6tiBushnl8giAK079Aqw1iLyhypemag/uXQksu/FQ09VSOjgFKYwEcHPkEQEIQequijAk2AxsMnUV7uTGNTQuNoKSimVRQ7jG9lbneRWd3NTGwuPCvl728Zq3p6pVqLSdOUWpJRrQpxkmAzi7UW63IAj96X5/lEgUcx0hSjgDD0CaO8Kje+9Z/Dg/23AuvW4/bHNsgNS9bw54fWsnTVZjYNa+ouIvA1gbEYr0EscW5LHwAZO6qMPr7cTkg3rCrHmF2jTO88VBDncArwIrTvEwZQiAwmDPGjAl4Y4CvB2pThVGHTGC0ZUahpbYqY2OIzs63E3I4C09oKdDUHtJUiuv4BIP5XHv+2YN16PL5pWB54fBN/fmgDtz+6gZW9I/QNJ2Q2T2N5XoBnPDzdyA00LIoAslFK96hDoMq7pkgjjSQNjZdptFoXZbHONLINGcrzUcbD830838MEBuN7aM8HnVfgxGWAEAQ+xtOEoaY1FNoKiu6SR3elSEc5YFwppLPiUwk9moshk5pCtR2sL/Hx2PrN8vCTvTy4Yj0Prx7isXXDrOqN2TxiSW1u8IsXoY0m8jI8Y9DKYJTJV1U96rcFylqEPOWTCwBGT9tgG+kd5SzSUCzkejAQLWijMEZjjMbzPbzAR2sP0ZpUb3HeRhquhV5AYIRQOUqhT1MxoBgGFLXQ5GU0+46iFgLtCIKQwA9yzzElWM/hUiFLM1ySx7GpZPgqo+w7OlsjpnW3MbOrhSnju9R2sP4Lj2XrNssT6wdZvmYjj6wZ4YmNMRsGUtb1JQzXaiTOEluLc4LBxxgPrQ1KGYxWeCrv00rDhTBnfY2ewButiJzkvgYNa7f8ZbdV2CEIghKFdqMVOU2emreg6jgMmWgyFNaBFZdnPzKbE3ys5Kd1AVyWH6iMwXjQXNS0NWu62yKmdrcwp7uJ2VO7mNHZxKTOMpMrRbV9ZX0Rj9W9Q9IzWGN9f8rqzVXWbBxmY38/G/qH6R1xbBxKGK476okiyTKyzJHaHJi53VYeC0sjj6u0y91qRG11HHdjKbPRvzu2mLflp3cDqc6ralrwEIwBPxCi0Kfga0pRSHNTkY5mj+7WMhPbm5jQUWRCWxPjKyEdLQUmtZZeWhqs7eOvTCf1j8hQLAwN16nGMdV6ncGROv2ZplrNGKnGJGlKPUlJnUaUIsksmbVIo9GbuIY5/GhWSeddMY2CKAgolyIKgaYQepQKHk2FkEIU0FQIqZRCygXDtLbyizqG/X9W9Bzw4r3OZwAAAABJRU5ErkJggg==";

const SwellLogo = ({ size = 40, light = false }) => (
  <img src={SWELL_LOGO} alt="Swell" style={{ width: size * 2, height: size, objectFit: "contain", filter: light ? "brightness(0) invert(1)" : "none" }} />
)

const STEPS = [
  "Project Fundamentals",
  "Revenue Structure",
  "Risk Profile",
  "Capital Stack",
  "Impact & MRV",
  "Governance",
];

const SECTORS = [
  "Coastal Restoration / Blue Carbon",
  "Sustainable Aquaculture",
  "Marine Renewable Energy",
  "Ocean Biotech",
  "Sustainable Fisheries",
  "Marine Conservation / MPAs",
  "Other",
];

const REGIONS = [
  "Southeast Asia",
  "Sub-Saharan Africa",
  "Latin America & Caribbean",
  "Small Island Developing States (SIDS)",
  "South Asia",
  "Middle East & North Africa",
  "Europe",
  "North America",
  "Oceania / Pacific",
];

const STAGES = [
  "Concept / Pre-feasibility",
  "Feasibility / Pilot",
  "Construction-ready",
  "Operational / Scaling",
];

const REVENUE_STREAMS = [
  { id: "carbon", label: "Carbon credit sales (voluntary or compliance)" },
  { id: "biodiversity", label: "Biodiversity offset / credits" },
  { id: "pes", label: "Payments for ecosystem services (PES)" },
  { id: "offtake", label: "Product offtake (aquaculture, biomass, etc.)" },
  { id: "tourism", label: "Eco-tourism / sustainable tourism" },
  { id: "energy", label: "Energy sales (PPA / tariff)" },
  { id: "grants", label: "Grants / philanthropic income" },
  { id: "gov", label: "Government subsidies / incentives" },
  { id: "other", label: "Other" },
];

const CARBON_METHODOLOGIES = [
  "Verra VCS (VM0033 – Tidal Wetland)",
  "Verra VCS (VM0007 – REDD+ Mangrove)",
  "Gold Standard – Blue Carbon",
  "Plan Vivo – Community Mangrove",
  "Methodology under development",
  "Not applicable",
];

const RISK_ITEMS = [
  { id: "tenure", label: "Land / marine tenure security", help: "Is tenure legally established?" },
  { id: "permitting", label: "Regulatory / permitting status", help: "Are permits secured?" },
  { id: "offtake_risk", label: "Offtake / revenue certainty", help: "Are contracts signed?" },
  { id: "tech", label: "Technology maturity", help: "Is the technology proven at scale?" },
  { id: "construction", label: "Construction / execution risk", help: "Is the EPC contractor identified?" },
  { id: "political", label: "Political / sovereign risk", help: "Country stability & rule of law" },
  { id: "climate_phys", label: "Physical climate risk", help: "Exposure to storms, sea-level rise, etc." },
  { id: "mrv_risk", label: "MRV / verification risk", help: "Can impacts be credibly measured?" },
];

const RISK_LEVELS = ["Low", "Medium", "High", "Not assessed"];

const DFI_SOURCES = [
  "GCF — Deeply Concessional (Tier 1)",
  "GCF — Moderately Concessional (Tier 2)",
  "Global Environment Facility (GEF)",
  "IFC Blended Finance Facility",
  "ADB — Concessional OCR",
  "ADB — Regular OCR",
  "IDA (World Bank concessional)",
  "U.S. DFC (political risk insurance)",
  "Inter-American Development Bank (IDB)",
  "African Development Bank (AfDB)",
  "Bilateral DFI (specify)",
  "None identified yet",
];

const DFI_TERMS = {
  "GCF — Deeply Concessional (Tier 1)": {
    rate: "0% interest + 0.75% service fee",
    grace: "5–10 years",
    maturity: "15–40 years",
    instrument: "Concessional loan",
    source: "GCF Board Decision B.09/04",
    note: "Available to accredited entities in developing countries for climate mitigation/adaptation. Deepest concessionality tier.",
  },
  "GCF — Moderately Concessional (Tier 2)": {
    rate: "Benchmark rate (ECB/UST) + 0.75% service fee",
    grace: "2–4 years",
    maturity: "8–15 years",
    instrument: "Concessional loan",
    source: "GCF Board Decision B.09/04",
    note: "For projects requiring less concessionality. Rate indexed to ECB rate (EUR) or U.S. Treasury bond rate (USD).",
  },
  "Global Environment Facility (GEF)": {
    rate: "0.25% (Seychelles Blue Bond precedent)",
    grace: "10 years",
    maturity: "40 years",
    instrument: "Concessional loan",
    source: "Seychelles Blue Bond (2018): GEF $5M concessional loan at 0.25%, 40-yr maturity, 10-yr grace. World Bank, 2018.",
    note: "GEF operates via implementing agencies (World Bank, UNDP, UNEP). Terms are deal-specific but tend toward deep concessionality.",
  },
  "IFC Blended Finance Facility": {
    rate: "Case-by-case (market price minus concessional subsidy)",
    grace: "Flexible (longer for greenfield)",
    maturity: "Flexible",
    instrument: "Senior/subordinated debt, equity, first-loss guarantee",
    source: "IFC Blended Finance: $5.9B committed to 539 projects since 2010, mobilizing $32.6B total (5.5x leverage). IFC, 2024.",
    note: "IFC does not publish fixed rate schedules. Concessionality = difference between market reference price and concessional price charged. Minimum concessionality principle applies.",
  },
  "ADB — Concessional OCR": {
    rate: "1–2% fixed",
    grace: "5–10 years",
    maturity: "25–40 years",
    instrument: "Concessional loan",
    source: "ADB Operations Manual D2; ADB Information Statement 2025. Emergency assistance: 1%, 40-yr, 10-yr grace. Standard COL: 2% fixed, 25-yr, 5-yr grace.",
    note: "Available to Group A (concessional-only) and Group B (blend) ADB member countries. Principal repayment at 2%/yr for first 10 years, 4%/yr thereafter.",
  },
  "ADB — Regular OCR": {
    rate: "SOFR + 0.75% (near-market)",
    grace: "5 years",
    maturity: "25 years (max avg maturity 19 years for FLP)",
    instrument: "Flexible Loan Product (FLP)",
    source: "ADB Flexible Loan Product terms; ADB Information Statement 2025.",
    note: "Near-market pricing. Available to Group B and C countries. Maturity premium may apply for longer tenors.",
  },
  "IDA (World Bank concessional)": {
    rate: "0% (grants) or near-zero (credits)",
    grace: "5–10 years",
    maturity: "25–40 years",
    instrument: "Concessional loan / grant",
    source: "IDA lending terms. Repayments stretched over 25–40 years with 5–10 year grace periods.",
    note: "Available to poorest countries (GNI per capita below IDA threshold). IDA20/21 replenishment expanded climate focus.",
  },
  "U.S. DFC (political risk insurance)": {
    rate: "N/A — insurance product, not a loan",
    grace: "N/A",
    maturity: "N/A",
    instrument: "Political risk insurance (PRI)",
    source: "Belize Blue Loan (2021): DFC PRI enabled Aa2 rating (16-notch uplift from Caa3). 10-yr grace, 19-yr maturity on underlying loan. TNC/NatureVest Case Study.",
    note: "DFC does not lend directly in this model. PRI covers political risk (expropriation, political violence, breach of contract), allowing blue bonds to achieve investment-grade ratings and access institutional capital at lower spreads.",
  },
};

const CREDIT_ENHANCEMENT_TYPES = [
  "None / not yet identified",
  "Partial credit guarantee (PCG)",
  "Political risk insurance (PRI)",
  "First-loss subordination",
  "Parametric insurance (natural disaster)",
  "Full credit guarantee",
  "Revenue guarantee / minimum offtake guarantee",
];

const CREDIT_ENHANCEMENT_DETAILS = {
  "Partial credit guarantee (PCG)": {
    description: "A third party (typically an MDB or DFI) guarantees a portion of debt service payments, reducing credit risk for senior lenders and enabling lower borrowing costs or longer tenors.",
    mechanism: "Guarantor covers a defined percentage of principal and/or interest in the event of default. Does not cover full repayment — only the guaranteed portion.",
    typicalProvider: "IBRD (World Bank), MIGA, ADB, AfDB, regional DFIs",
    typicalCoverage: "Up to 33–50% of bond/loan principal",
    costIndicative: "Guarantee fee typically 0.5–1.5% of guaranteed amount per annum",
    ratingImpact: "Can achieve 2–6 notch rating uplift depending on guarantor's own rating and coverage level",
    precedent: "Seychelles Blue Bond (2018): IBRD provided a $5M partial credit guarantee on a $15M bond (33% coverage), enabling Seychelles to access private capital markets at 6.5% coupon. The guarantee, combined with a $5M GEF concessional loan, reduced the effective borrowing cost to ~2.8%. (World Bank, 2018)",
    termSheetLanguage: "The [Guarantor] shall provide an irrevocable partial credit guarantee in an amount not to exceed [amount], covering [X]% of scheduled principal repayments on the Senior Tranche. The guarantee shall be callable upon a payment default by the Borrower that remains uncured for [30/60] days following written notice.",
  },
  "Political risk insurance (PRI)": {
    description: "An insurer (typically a bilateral DFI or multilateral agency) covers losses arising from specified political events — expropriation, political violence, currency inconvertibility, or breach of contract by a sovereign entity.",
    mechanism: "Insurer pays out upon occurrence of a covered political event. Does not cover commercial/credit risk. Transforms sovereign risk into insurer's credit risk, enabling dramatic rating uplift.",
    typicalProvider: "U.S. DFC (formerly OPIC), MIGA (World Bank), Lloyd's syndicates, private insurers with DFI reinsurance",
    typicalCoverage: "Up to 100% of an arbitration award arising from loan default due to political events",
    costIndicative: "Premium typically 0.5–2.0% of insured amount per annum, depending on country risk and coverage scope",
    ratingImpact: "Can achieve 10–16+ notch rating uplift. Belize precedent: Caa3 → Aa2 (16 notches)",
    precedent: "Belize Debt-for-Nature Swap (2021): U.S. DFC provided political risk insurance covering 100% of an arbitration award arising from loan default. The DFC policy, heavily supported by private reinsurers organized by Alliant Insurance Services, enabled the Blue Bonds to receive an Aa2 rating — a 16-notch uplift from Belize's Caa3 sovereign rating. Without the insurance, institutional investors would not have participated. (TNC/NatureVest Case Study; IMF, 2022)",
    termSheetLanguage: "The [Insurer] shall issue a political risk insurance policy covering [100]% of an arbitration award arising from Borrower default attributable to: (a) expropriation or nationalization; (b) political violence; (c) currency inconvertibility or transfer restriction; or (d) breach of contract by the Host Government. The policy shall remain in force for the tenor of the Senior Tranche.",
  },
  "First-loss subordination": {
    description: "A concessional capital provider (DFI, philanthropy, or catalytic fund) takes a subordinated position in the capital stack, absorbing initial losses before senior lenders are impacted. This structurally de-risks the senior tranche.",
    mechanism: "Concessional capital is contractually subordinated — in liquidation or cash flow waterfall, it is repaid only after senior obligations are satisfied in full. The first-loss provider accepts a higher probability of loss in exchange for catalytic impact.",
    typicalProvider: "GCF, GEF, philanthropic foundations (Rockefeller, Bloomberg, Packard), impact-first funds (Encourage Capital, Meloy Fund)",
    typicalCoverage: "Typically 10–30% of total capital stack as first-loss cushion",
    costIndicative: "Concessional return (0–5%) or grant equivalent. The cost to the project is the blended return across tranches.",
    ratingImpact: "Improves senior tranche risk profile by 1–4 notches equivalent (not formal rating agency uplift but structural credit enhancement)",
    precedent: "Mirova Sustainable Ocean Fund (2020): Benefits from 'sovereign shared risk guarantee and significant institutional co-investment' — concessional/catalytic capital takes subordinated position to attract commercial co-investors. FMO committed $7.5M as equity (subordinated to senior claims). (Mirova, 2020; FMO Project #53527; EIB fund page)",
    termSheetLanguage: "The Concessional Tranche shall be structurally subordinated to the Senior Tranche and the Mezzanine Tranche. In the event of a Borrower default, available cash flows and liquidation proceeds shall be applied first to satisfy all obligations under the Senior Tranche, then the Mezzanine Tranche, before any distribution to the Concessional Tranche. The Concessional Tranche provider acknowledges and accepts a first-loss position up to [amount / %] of total facility size.",
  },
  "Parametric insurance (natural disaster)": {
    description: "A commercial insurance product that pays out automatically when a pre-defined physical trigger is met (e.g., hurricane wind speed exceeding a threshold, earthquake magnitude), regardless of actual losses. Provides rapid liquidity for coastal/marine projects exposed to climate events.",
    mechanism: "Payout is triggered by objective, independently verified physical parameters — not by assessed losses. This eliminates claims disputes and dramatically accelerates disbursement (typically within 14–30 days of trigger event).",
    typicalProvider: "Munich Re, Swiss Re, AXA Climate, Caribbean Catastrophe Risk Insurance Facility (CCRIF), African Risk Capacity (ARC), Lloyd's syndicates",
    typicalCoverage: "Covers a defined maximum payout per event. Does not cover full reconstruction — designed for rapid liquidity and debt service continuity.",
    costIndicative: "Premium typically 2–8% of maximum payout per annum, depending on geography, peril type, and attachment point",
    ratingImpact: "Enhances project resilience and debt service continuity, which may improve lender comfort and terms. Not a direct credit rating instrument.",
    precedent: "Belize Debt-for-Nature Swap (2021): Incorporated a commercial parametric insurance policy to mitigate the financial impact of natural disasters on the Blue Loan's debt service capacity. The policy was structured alongside the DFC political risk insurance as part of the overall credit enhancement package. (TNC/NatureVest Case Study)",
    termSheetLanguage: "The Project Company shall maintain a parametric insurance policy with a minimum coverage of [amount] per event, with trigger parameters defined as [e.g., sustained hurricane wind speed ≥ Category 3 / 111 mph within 50 nautical miles of project site]. Policy proceeds shall be applied first to restore project operations and second to debt service continuity in accordance with the revenue waterfall.",
  },
  "Full credit guarantee": {
    description: "A guarantor covers 100% of principal and interest obligations. Strongest form of credit enhancement — effectively substitutes the guarantor's credit for the borrower's.",
    mechanism: "Guarantor is unconditionally liable for all scheduled debt service payments upon borrower default. Lenders look through to guarantor's creditworthiness.",
    typicalProvider: "Sovereign governments (for state-owned enterprises), IBRD (rare for full coverage), export credit agencies",
    typicalCoverage: "100% of principal and interest",
    costIndicative: "Guarantee fee 1–3% of guaranteed amount per annum. Higher than partial guarantee due to full exposure.",
    ratingImpact: "Borrowing entity effectively inherits guarantor's credit rating",
    precedent: "No blue economy-specific precedent at full guarantee level. Green bond market analogy: sovereign guarantees on green infrastructure bonds in SIDS have been used to enable capital market access.",
    termSheetLanguage: "The [Guarantor] shall provide an unconditional and irrevocable guarantee of all amounts of principal, interest, and other charges payable under the Senior Tranche, such guarantee to remain in force until all obligations thereunder have been satisfied in full.",
  },
  "Revenue guarantee / minimum offtake guarantee": {
    description: "A third party guarantees a minimum revenue floor or offtake volume, reducing market/demand risk for the project. Particularly relevant for aquaculture offtake or carbon credit purchase agreements.",
    mechanism: "If actual revenues or offtake volumes fall below a guaranteed floor, the guarantor pays the difference. Provides revenue certainty for debt sizing and DSCR calculations.",
    typicalProvider: "Government agencies, development banks (advance market commitments), anchor offtakers, philanthropic foundations",
    typicalCoverage: "Covers shortfall between actual and guaranteed minimum revenue/volume for a defined period (typically 3–7 years)",
    costIndicative: "Varies widely. Government guarantees may be at nominal cost; commercial arrangements priced at 1–5% of guaranteed revenue per annum.",
    ratingImpact: "Reduces revenue volatility, improving DSCR stability and potentially enabling tighter senior debt pricing",
    precedent: "Mirova Sustainable Ocean Fund uses 'advance market commitments' as an innovative financial approach to de-risk investments in sustainable seafood and ocean conservation. (Mirova/EIB fund overview)",
    termSheetLanguage: "The [Guarantor] shall guarantee a minimum annual revenue floor of [amount] for the Project for a period of [X] years from Commercial Operations Date. In the event that actual Project revenues in any fiscal year fall below the guaranteed floor, the Guarantor shall pay the shortfall amount within [30] days of the annual revenue certification.",
  },
};

const IMPACT_METRICS = [
  { id: "co2", label: "CO₂ sequestered / avoided (tCO₂e/yr)" },
  { id: "hectares", label: "Hectares restored / protected" },
  { id: "biodiversity", label: "Biodiversity indicators (species count, habitat quality)" },
  { id: "jobs", label: "Jobs created (direct / indirect)" },
  { id: "livelihoods", label: "Livelihoods supported" },
  { id: "food", label: "Sustainable protein / food produced (tonnes/yr)" },
  { id: "water", label: "Water quality improvement" },
  { id: "resilience", label: "Coastal resilience (storm protection value)" },
];

const MRV_STATUS = [
  "Third-party verified methodology in place",
  "Methodology identified, verification pending",
  "Methodology under development",
  "No MRV framework yet",
];

const fmt = (n) => {
  if (!n && n !== 0) return "—";
  const num = typeof n === "string" ? parseFloat(n.replace(/,/g, "")) : n;
  if (isNaN(num)) return "—";
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
};

const pct = (n) => (n ? `${n}%` : "—");

const MISSING_VALUES = new Set([null, undefined, "", "unknown", "Unknown", "n/a", "N/A"]);

const normalizeOptional = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const selectedLabels = (selectedMap, sourceOptions) =>
  sourceOptions
    .filter((item) => selectedMap?.[item.id])
    .map((item) => item.label);

const QUESTIONNAIRE_TO_UI_FIELD_MAP = {
  total_capital_cost_usd: "totalCapital",
  construction_period_months: "constructionMonths",
  expected_project_life_years: "projectLife",
  brief_project_description: "description",
  primary_revenue_stream: "primaryRevenue",
  estimated_annual_revenue_steady_state_usd: "annualRevenue",
  additional_risk_notes: "riskNotes",
  equity_contribution_from_sponsor_pct: "sponsorEquity",
  concessional_catalytic_tranche_pct: "concessionalPct",
  mezzanine_impact_pct: "mezzaninePct",
  identified_dfi_concessional_source: "dfiSource",
  dfi_engagement_status: "dfiStatus",
  credit_enhancement_structure: "creditEnhancement",
  preferred_capital_structure_notes: "capitalNotes",
  mrv_status: "mrvStatus",
  third_party_verifier: "verifier",
  impact_linked_return_mechanism: "impactLinked",
  sdg_alignment: "sdgAlignment",
  project_company_name: "spvName",
  sponsor_entity: "sponsorEntity",
  jurisdiction_of_incorporation: "jurisdiction",
  reporting_cadence: "reportingCadence",
  target_financial_close: "targetClose",
  conditions_precedent: "conditionsPrecedent",
  "key team members": "teamMembers",
};

const RISK_QUESTIONNAIRE_TO_UI_MAP = {
  land_marine_tenure_security: "tenure",
  regulatory_permitting_status: "permitting",
  offtake_revenue_certainty: "offtake_risk",
  technology_maturity: "tech",
  construction_execution_risk: "construction",
  political_sovereign_risk: "political",
  physical_climate_risk: "climate_phys",
  mrv_verification_risk: "mrv_risk",
};

const ESTIMATE_FIELD_TO_UI_SUGGESTION_MAP = {
  ...QUESTIONNAIRE_TO_UI_FIELD_MAP,
  revenue_streams: "revenueStreams",
  impact_metrics_reporting: "impactMetrics",
};

const NUMERIC_UI_FIELDS = new Set([
  "totalCapital",
  "constructionMonths",
  "projectLife",
  "annualRevenue",
  "sponsorEquity",
  "concessionalPct",
  "mezzaninePct",
]);

const CHOICE_UI_FIELDS = new Set([
  "sector",
  "region",
  "stage",
  "primaryRevenue",
  "dfiSource",
  "dfiStatus",
  "creditEnhancement",
  "mrvStatus",
  "impactLinked",
  "reportingCadence",
  "revenueStreams",
  "impactMetrics",
]);

const SELECT_OPTIONS_BY_UI_KEY = {
  primaryRevenue: REVENUE_STREAMS.map((item) => item.label),
  dfiSource: DFI_SOURCES,
  dfiStatus: ["No contact yet", "Informal discussion", "Formal expression of interest", "Term sheet / commitment in place"],
  creditEnhancement: CREDIT_ENHANCEMENT_TYPES,
  mrvStatus: MRV_STATUS,
  impactLinked: ["Yes — returns partially indexed to impact KPIs", "No — standard fixed return structure", "Open to discussion"],
  reportingCadence: ["Monthly", "Quarterly", "Semi-annually", "Annually"],
};

const splitSuggestionItems = (value) =>
  String(value || "")
    .split(/[\n,;|]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const applySuggestionOverrides = (baseData, fieldSuggestions) => {
  const nextData = {
    ...baseData,
    risks: { ...(baseData.risks || {}) },
    revenueStreams: { ...(baseData.revenueStreams || {}) },
    impactMetrics: { ...(baseData.impactMetrics || {}) },
  };
  for (const [uiKey, suggestion] of Object.entries(fieldSuggestions || {})) {
    if (!suggestion?.active) continue;
    const text = String(suggestion.text || "").trim();
    if (!text) continue;
    if (uiKey === "revenueStreams") {
      const tokens = splitSuggestionItems(text).map(normalizeToken);
      const selected = {};
      for (const item of REVENUE_STREAMS) {
        const normalizedLabel = normalizeToken(item.label);
        selected[item.id] = tokens.some(
          (token) => normalizedLabel.includes(token) || token.includes(normalizedLabel),
        );
      }
      nextData.revenueStreams = selected;
      continue;
    }
    if (uiKey === "impactMetrics") {
      const tokens = splitSuggestionItems(text).map(normalizeToken);
      const selected = {};
      for (const item of IMPACT_METRICS) {
        const normalizedLabel = normalizeToken(item.label);
        selected[item.id] = tokens.some(
          (token) => normalizedLabel.includes(token) || token.includes(normalizedLabel),
        );
      }
      nextData.impactMetrics = selected;
      continue;
    }
    nextData[uiKey] = text;
  }
  return nextData;
};

const extractChoiceFieldSuggestions = (estimates) => {
  const suggestions = {};
  for (const estimate of estimates || []) {
    if (!estimate || typeof estimate !== "object") continue;
    const uiKey = ESTIMATE_FIELD_TO_UI_SUGGESTION_MAP[estimate.field_name];
    if (!uiKey || !CHOICE_UI_FIELDS.has(uiKey)) continue;
    const estimatedValue = typeof estimate.estimated_value === "string" ? estimate.estimated_value.trim() : "";
    if (!estimatedValue) continue;
    suggestions[uiKey] = {
      text: estimatedValue,
      active: true,
    };
  }
  return suggestions;
};

const normalizeToken = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const coerceNumericValue = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value !== "string") {
    return null;
  }
  const matches = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/g);
  if (!matches || matches.length === 0) {
    return null;
  }
  return matches[0];
};

const matchSelectOption = (value, options) => {
  if (!Array.isArray(options) || options.length === 0) {
    return String(value);
  }
  const raw = normalizeToken(value);
  if (!raw) {
    return null;
  }
  const exact = options.find((option) => normalizeToken(option) === raw);
  if (exact) return exact;
  const contains = options.find((option) => {
    const normalizedOption = normalizeToken(option);
    return normalizedOption.includes(raw) || raw.includes(normalizedOption);
  });
  if (contains) return contains;
  return null;
};

const coerceSelectValue = (uiKey, value) => {
  const options = SELECT_OPTIONS_BY_UI_KEY[uiKey];
  const direct = matchSelectOption(value, options);
  if (direct) return direct;
  if (typeof value !== "string") return null;
  const raw = normalizeToken(value);

  if (uiKey === "primaryRevenue") {
    if (raw.includes("offtake") || raw.includes("product") || raw.includes("sale")) {
      return "Product offtake (aquaculture, biomass, etc.)";
    }
    if (raw.includes("carbon")) return "Carbon credit sales (voluntary or compliance)";
    if (raw.includes("tourism")) return "Eco-tourism / sustainable tourism";
    if (raw.includes("energy")) return "Energy sales (PPA / tariff)";
  }
  if (uiKey === "dfiSource" && (raw.includes("not yet") || raw.includes("tbd") || raw.includes("none") || raw.includes("unknown"))) {
    return "None identified yet";
  }
  if (uiKey === "dfiStatus") {
    if (raw.includes("term sheet") || raw.includes("commitment")) return "Term sheet / commitment in place";
    if (raw.includes("formal")) return "Formal expression of interest";
    if (raw.includes("informal") || raw.includes("exploratory")) return "Informal discussion";
    if (raw.includes("no contact") || raw.includes("not yet")) return "No contact yet";
  }
  if (uiKey === "creditEnhancement") {
    if (raw.includes("political risk")) return "Political risk insurance (PRI)";
    if (raw.includes("partial credit")) return "Partial credit guarantee (PCG)";
    if (raw.includes("full credit")) return "Full credit guarantee";
    if (raw.includes("first loss")) return "First-loss subordination";
    if (raw.includes("parametric")) return "Parametric insurance (natural disaster)";
    if (raw.includes("revenue")) return "Revenue guarantee / minimum offtake guarantee";
  }
  if (uiKey === "reportingCadence") {
    if (raw.includes("quarter")) return "Quarterly";
    if (raw.includes("semi")) return "Semi-annually";
    if (raw.includes("annual")) return "Annually";
    if (raw.includes("month")) return "Monthly";
  }
  if (uiKey === "impactLinked") {
    if (raw.includes("open")) return "Open to discussion";
    if (raw.includes("no")) return "No — standard fixed return structure";
    if (raw.includes("yes") || raw.includes("indexed") || raw.includes("kpi")) {
      return "Yes — returns partially indexed to impact KPIs";
    }
  }
  return null;
};

const titleCaseRisk = (value) => {
  const token = normalizeToken(value);
  if (!token) return null;
  if (token === "low") return "Low";
  if (token === "medium") return "Medium";
  if (token === "high") return "High";
  if (token.includes("not") && token.includes("assess")) return "Not assessed";
  return null;
};

const hasMeaningfulValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

const formatRangeValue = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
};

const buildRangeLabel = (estimate) => {
  const low = formatRangeValue(estimate?.range_low);
  const high = formatRangeValue(estimate?.range_high);
  if (low && high) return `${low} - ${high}`;
  if (typeof estimate?.estimated_value === "string" && estimate.estimated_value.trim()) {
    return estimate.estimated_value.trim();
  }
  return "Not provided";
};

const normalizeEstimateInsights = (estimates) => {
  const insights = {};
  for (const estimate of estimates || []) {
    if (!estimate || typeof estimate !== "object") continue;
    const uiKey = QUESTIONNAIRE_TO_UI_FIELD_MAP[estimate.field_name];
    if (!uiKey) continue;
    const assumptions = Array.isArray(estimate.assumptions)
      ? estimate.assumptions.filter((item) => typeof item === "string" && item.trim())
      : [];
    const reasoning = typeof estimate.reasoning === "string" ? estimate.reasoning.trim() : "";
    insights[uiKey] = {
      confidence: typeof estimate.confidence === "string" ? estimate.confidence : "unknown",
      reasoningBullets: reasoning ? [reasoning] : [],
      assumptions,
      rangeLabel: buildRangeLabel(estimate),
    };
  }
  return insights;
};

const buildQuestionnairePayload = (data) => ({
  project_name: normalizeOptional(data.projectName) || "Untitled Blue Finance Project",
  geography: normalizeOptional(data.country) || normalizeOptional(data.region),
  sector: normalizeOptional(data.sector),
  subsector: normalizeOptional(data.sector),
  instrument_type: "Blue bond",
  project_stage: normalizeOptional(data.stage),
  use_of_proceeds: normalizeOptional(data.description),
  total_capital_cost_usd: normalizeOptional(data.totalCapital),
  construction_period_months: normalizeOptional(data.constructionMonths),
  expected_project_life_years: normalizeOptional(data.projectLife),
  brief_project_description: normalizeOptional(data.description),
  revenue_streams: selectedLabels(data.revenueStreams, REVENUE_STREAMS),
  primary_revenue_stream: normalizeOptional(data.primaryRevenue),
  estimated_annual_revenue_steady_state_usd: normalizeOptional(data.annualRevenue),
  land_marine_tenure_security: normalizeOptional(data.risks?.tenure)?.toLowerCase() || null,
  regulatory_permitting_status: normalizeOptional(data.risks?.permitting)?.toLowerCase() || null,
  offtake_revenue_certainty: normalizeOptional(data.risks?.offtake_risk)?.toLowerCase() || null,
  technology_maturity: normalizeOptional(data.risks?.tech)?.toLowerCase() || null,
  construction_execution_risk: normalizeOptional(data.risks?.construction)?.toLowerCase() || null,
  political_sovereign_risk: normalizeOptional(data.risks?.political)?.toLowerCase() || null,
  physical_climate_risk: normalizeOptional(data.risks?.climate_phys)?.toLowerCase() || null,
  mrv_verification_risk: normalizeOptional(data.risks?.mrv_risk)?.toLowerCase() || null,
  additional_risk_notes: normalizeOptional(data.riskNotes),
  equity_contribution_from_sponsor_pct: normalizeOptional(data.sponsorEquity),
  concessional_catalytic_tranche_pct: normalizeOptional(data.concessionalPct),
  mezzanine_impact_pct: normalizeOptional(data.mezzaninePct),
  identified_dfi_concessional_source: normalizeOptional(data.dfiSource),
  dfi_engagement_status: normalizeOptional(data.dfiStatus),
  credit_enhancement_structure: normalizeOptional(data.creditEnhancement),
  preferred_capital_structure_notes: normalizeOptional(data.capitalNotes),
  impact_metrics_reporting: IMPACT_METRICS
    .filter((metric) => data.impactMetrics?.[metric.id])
    .map((metric) => metric.id),
  mrv_status: normalizeOptional(data.mrvStatus),
  third_party_verifier: normalizeOptional(data.verifier) || "",
  impact_linked_return_mechanism: normalizeOptional(data.impactLinked),
  sdg_alignment: normalizeOptional(data.sdgAlignment) || "",
  blended_finance_need_pct: normalizeOptional(data.concessionalPct),
  expected_impact_reporting_frequency: normalizeOptional(data.reportingCadence) || "",
  project_company_name: normalizeOptional(data.spvName),
  sponsor_entity: normalizeOptional(data.sponsorEntity),
  jurisdiction_of_incorporation: normalizeOptional(data.jurisdiction),
  reporting_cadence: normalizeOptional(data.reportingCadence),
  target_financial_close: normalizeOptional(data.targetClose),
  conditions_precedent: normalizeOptional(data.conditionsPrecedent),
  "key team members": normalizeOptional(data.teamMembers),
  notes: "Generated from the Swell questionnaire UI.",
});

const applyQuestionnaireValuesToUiData = (prevData, questionnaire) => {
  const nextData = { ...prevData };
  for (const [questionnaireKey, uiKey] of Object.entries(QUESTIONNAIRE_TO_UI_FIELD_MAP)) {
    const value = questionnaire[questionnaireKey];
    if (MISSING_VALUES.has(value)) {
      continue;
    }
    if (NUMERIC_UI_FIELDS.has(uiKey)) {
      const numeric = coerceNumericValue(value);
      if (numeric !== null) {
        nextData[uiKey] = numeric;
      }
      continue;
    }
    const selectValue = coerceSelectValue(uiKey, value);
    if (selectValue) {
      nextData[uiKey] = selectValue;
      continue;
    }
    nextData[uiKey] = String(value);
  }

  const nextRisks = { ...(nextData.risks || {}) };
  for (const [questionnaireKey, riskKey] of Object.entries(RISK_QUESTIONNAIRE_TO_UI_MAP)) {
    const riskValue = questionnaire[questionnaireKey];
    if (MISSING_VALUES.has(riskValue)) {
      continue;
    }
    const normalizedRisk = titleCaseRisk(riskValue);
    if (normalizedRisk) {
      nextRisks[riskKey] = normalizedRisk;
    }
  }
  if (Object.keys(nextRisks).length > 0) {
    nextData.risks = nextRisks;
  }
  return nextData;
};

// ─── Transaction Cost Estimator ───
// Based on two sourced data points:
//   Seychelles Blue Bond (2018): ~$425K on $15M = ~2.8% of deal value (simple structure, sovereign, World Bank-arranged)
//   Belize Debt-for-Nature Swap (2021): ~$85M on $364M = ~23.4% (complex multi-party, debt conversion, SPV, insurance)
// Model: base cost driven by deal size (economies of scale) + complexity multipliers
// Complexity factors: number of tranches, debt conversion vs. greenfield, number of jurisdictions, DFI involvement, insurance/guarantee

function estimateTransactionCosts(d) {
  const totalCap = parseFloat((d.totalCapital || "0").replace(/,/g, "")) || 0;
  if (totalCap === 0) return null;

  // Base cost as % of deal — inverse relationship with size (smaller deals = higher % cost)
  // Anchored to: $15M deal ≈ 3%, $100M deal ≈ 8%, $364M deal ≈ 15-23%
  let basePct;
  if (totalCap <= 10e6) basePct = 5.0;
  else if (totalCap <= 25e6) basePct = 3.5;
  else if (totalCap <= 50e6) basePct = 4.5;
  else if (totalCap <= 100e6) basePct = 6.0;
  else if (totalCap <= 250e6) basePct = 8.0;
  else basePct = 10.0;

  // Complexity multipliers
  let complexityMultiplier = 1.0;
  const complexityFactors = [];

  // Number of tranches
  const concPct = parseFloat(d.concessionalPct) || 0;
  const mezzPct = parseFloat(d.mezzaninePct) || 0;
  const numTranches = (concPct > 0 ? 1 : 0) + (mezzPct > 0 ? 1 : 0) + 1 + (d.sponsorEquity ? 1 : 0);
  if (numTranches >= 4) { complexityMultiplier += 0.3; complexityFactors.push("4+ tranches (+30%)"); }
  else if (numTranches >= 3) { complexityMultiplier += 0.15; complexityFactors.push("3 tranches (+15%)"); }

  // DFI involvement (adds regulatory/approval complexity but may cover some costs via grants)
  const dfi = d.dfiSource || "";
  if (dfi.includes("GCF") || dfi.includes("GEF") || dfi.includes("IDA")) {
    complexityMultiplier += 0.15;
    complexityFactors.push("Multilateral DFI involvement (+15%)");
  }
  if (dfi.includes("DFC")) {
    complexityMultiplier += 0.25;
    complexityFactors.push("Political risk insurance structuring (+25%)");
  }

  // Multiple revenue streams (more complex revenue waterfall)
  const numRevStreams = Object.values(d.revenueStreams || {}).filter(Boolean).length;
  if (numRevStreams >= 4) { complexityMultiplier += 0.2; complexityFactors.push("4+ revenue streams (+20%)"); }
  else if (numRevStreams >= 2) { complexityMultiplier += 0.1; complexityFactors.push("Multiple revenue streams (+10%)"); }

  // Carbon credits add MRV/methodology costs
  if (d.revenueStreams?.carbon) {
    complexityMultiplier += 0.1;
    complexityFactors.push("Carbon credit methodology validation (+10%)");
  }

  // Credit enhancement structure complexity
  const ce = d.creditEnhancement || "";
  if (ce.includes("Political risk insurance")) {
    complexityMultiplier += 0.2;
    complexityFactors.push("Political risk insurance structuring (+20%)");
  } else if (ce.includes("Parametric insurance")) {
    complexityMultiplier += 0.15;
    complexityFactors.push("Parametric insurance structuring (+15%)");
  } else if (ce.includes("Partial credit guarantee") || ce.includes("Full credit guarantee")) {
    complexityMultiplier += 0.1;
    complexityFactors.push("Credit guarantee documentation (+10%)");
  } else if (ce.includes("Revenue guarantee")) {
    complexityMultiplier += 0.1;
    complexityFactors.push("Revenue guarantee structuring (+10%)");
  }

  // Early stage = more development costs
  if (d.stage === "Concept / Pre-feasibility") { complexityMultiplier += 0.25; complexityFactors.push("Pre-feasibility stage (+25%)"); }
  else if (d.stage === "Feasibility / Pilot") { complexityMultiplier += 0.15; complexityFactors.push("Feasibility stage (+15%)"); }

  // High-risk jurisdictions
  const highRisks = Object.entries(d.risks || {}).filter(([, v]) => v === "High").length;
  if (highRisks >= 4) { complexityMultiplier += 0.2; complexityFactors.push("Multiple high-risk factors (+20%)"); }
  else if (highRisks >= 2) { complexityMultiplier += 0.1; complexityFactors.push("Elevated risk profile (+10%)"); }

  const totalPct = Math.min(basePct * complexityMultiplier, 30); // cap at 30%
  const totalCost = totalCap * (totalPct / 100);

  // Standardized template savings estimate (40-60% reduction)
  const savingsPct = 0.50; // 50% estimated reduction from standardization
  const standardizedCost = totalCost * (1 - savingsPct);
  const savings = totalCost - standardizedCost;

  // Cost breakdown (approximate allocation based on typical deal structuring)
  const breakdown = {
    legal: totalCost * 0.35,
    advisory: totalCost * 0.25,
    dueDiligence: totalCost * 0.15,
    mrvSetup: d.revenueStreams?.carbon ? totalCost * 0.10 : 0,
    insurance: (dfi.includes("DFC") || ce.includes("Political risk") || ce.includes("Parametric")) ? totalCost * 0.12 : ce.includes("guarantee") ? totalCost * 0.08 : totalCost * 0.05,
    other: 0,
  };
  breakdown.other = totalCost - Object.values(breakdown).reduce((a, b) => a + b, 0);

  return {
    totalPct: totalPct.toFixed(1),
    totalCost,
    complexityMultiplier: complexityMultiplier.toFixed(2),
    complexityFactors,
    basePct,
    standardizedCost,
    savings,
    savingsPct: (savingsPct * 100).toFixed(0),
    breakdown,
    numTranches,
  };
}

function generateTermSheet(d) {
  const totalCap = parseFloat((d.totalCapital || "0").replace(/,/g, "")) || 0;
  const equityPct = parseFloat(d.sponsorEquity) || 0;
  const equityAmt = totalCap * (equityPct / 100);
  const totalDebt = totalCap - equityAmt;
  const concPct = parseFloat(d.concessionalPct) || 25;
  const mezzPct = parseFloat(d.mezzaninePct) || 35;
  const seniorPct = 100 - concPct - mezzPct;
  const concAmt = totalDebt * (concPct / 100);
  const mezzAmt = totalDebt * (mezzPct / 100);
  const seniorAmt = totalDebt * (seniorPct / 100);

  const activeRevenue = REVENUE_STREAMS.filter((r) => d.revenueStreams?.[r.id]);
  const activeRisks = RISK_ITEMS.map((r) => ({
    ...r,
    level: d.risks?.[r.id] || "Not assessed",
  }));
  const highRisks = activeRisks.filter((r) => r.level === "High");
  const activeImpact = IMPACT_METRICS.filter((m) => d.impactMetrics?.[m.id]);

  const riskScore = activeRisks.reduce((acc, r) => {
    if (r.level === "High") return acc + 3;
    if (r.level === "Medium") return acc + 2;
    if (r.level === "Low") return acc + 1;
    return acc;
  }, 0);
  const maxRisk = activeRisks.length * 3;
  const riskPctScore = maxRisk > 0 ? ((riskScore / maxRisk) * 100).toFixed(0) : "—";

  const sectorTemplates = {
    "Coastal Restoration / Blue Carbon": {
      typicalDSCR: "1.20x – 1.35x (indicative; limited project-level precedent)",
      typicalTenor: "10–20 years",
      concTerms: "0.25% interest, 10-year grace, up to 40-year tenor (per GEF concessional loan to Seychelles Blue Bond, 2018)",
      mezzReturn: "6–10% blended IRR (Mirova SOF targets commercial returns with sovereign shared-risk guarantee)",
      seniorRate: "SOFR + 400–600bps (8–12% indicative for project-level SPV borrowers)",
      carbonPriceNote: "Blue carbon credits: $20–30/tCO₂e (Environmental Finance, 2024); $26.03 avg mangrove VCM price 2023, $32/tCO₂e reported trades 2024 (Frontiers in Marine Science, 2025); IFC range $15–35/credit (IFC, 2023)",
      bufferNote: "Standard 20% buffer deduction for non-permanence risk (ICVCM Core Carbon Principles; Perera et al. 2024 reports 10–30% range)",
      keyCovenants: [
        "Minimum annual carbon credit issuance ≥ 70% of projected volume",
        "Third-party MRV verification completed annually",
        "Hectares under active restoration ≥ agreed schedule",
        "Community benefit-sharing payments current",
        "Conservation milestone escalation: if milestone missed, annual payment increases by $1.25M (first miss) + $250K per additional miss (per Belize debt-for-nature swap, 2021)",
      ],
      precedents: [
        "Seychelles Blue Bond (2018): $15M, 10-yr, 6.5% coupon, GEF $5M concessional loan (0.25%, 40-yr, 10-yr grace), IBRD $5M partial credit guarantee, Rockefeller $425K grant for transaction costs. Effective borrowing cost ~2.8%. Investors: Calvert, Nuveen, Prudential. (World Bank, 2018)",
        "Belize Debt-for-Nature Swap (2021): $364M Blue Loan via TNC/BBIC, retired $553M superbond at 55¢/$. DFC political risk insurance → Aa2 rating. 10-yr grace, 19-yr maturity. 24-month DSRA. $180M conservation funding over 20 years. Transaction costs ~$85M. (TNC/NatureVest Case Study; IMF, 2022)",
        "Convergence Database: 16 closed SDG 14 transactions totaling $2.5B committed financing as of 2022; only ~1% of total blended finance flows target SDG 14. (Convergence, 2022)",
      ],
    },
    "Sustainable Aquaculture": {
      typicalDSCR: "1.30x – 1.50x (indicative; based on general aquaculture project finance)",
      typicalTenor: "7–12 years",
      concTerms: "1–3% interest, 2–3 year grace, 8–12 year tenor (indicative DFI concessional terms)",
      mezzReturn: "8–14% blended IRR (Mirova SOF invests across aquaculture value chain; Aqua-Spark open-ended fund model)",
      seniorRate: "SOFR + 300–500bps (indicative; limited public aquaculture PF precedent)",
      keyCovenants: [
        "ASC or equivalent certification maintained",
        "Minimum offtake contract coverage ≥ 60% of production",
        "Disease event loss reserves funded per schedule",
        "Environmental monitoring reports delivered quarterly",
      ],
      precedents: [
        "Mirova Sustainable Ocean Fund (2018/2020): $132M final close, invests in sustainable seafood, circular economy, and ocean conservation. Growth equity, sovereign shared-risk guarantee, FMO $7.5M commitment. (Mirova, 2020; FMO Project #53527)",
        "Meloy Fund: Blends concessional capital with HNW/family office investment for small-scale fishers in SE Asia. (Convergence, 2025)",
        "Blue Finance / Blended Blue Finance Facility: Convergence design grant for aggregated MPA project pipeline; revenue models include eco-tourism, blue carbon, and community aquaculture. (Convergence, 2022)",
      ],
    },
    "Marine Renewable Energy": {
      typicalDSCR: "1.25x – 1.40x",
      typicalTenor: "15–25 years",
      concTerms: "0–1% interest, 3–5 year grace, 20–25 year tenor (based on DFI infrastructure lending precedent)",
      mezzReturn: "7–12% blended IRR",
      seniorRate: "SOFR + 200–350bps (based on offshore wind project finance benchmarks; BNEF)",
      keyCovenants: [
        "PPA / tariff agreement in force",
        "Availability factor ≥ 90% annually",
        "O&M reserve funded per schedule",
        "Insurance coverage maintained per lender requirements",
      ],
      precedents: [
        "Limited blue-economy-specific marine energy project finance precedent; terms extrapolated from offshore wind PF benchmarks. Senior pricing and DSCR ranges based on BNEF/IEA published deal-level data for offshore wind.",
      ],
    },
  };

  const tmpl = sectorTemplates[d.sector] || sectorTemplates["Coastal Restoration / Blue Carbon"];
  const txCosts = estimateTransactionCosts(d);

  return {
    totalCap, totalDebt, equityPct, equityAmt, concPct, mezzPct, seniorPct, concAmt, mezzAmt, seniorAmt,
    activeRevenue, activeRisks, highRisks, activeImpact,
    riskPctScore, tmpl, txCosts,
  };
}

// ─── Styles ───
const colors = {
  navy: "#0a1628",
  deepBlue: "#0f2847",
  ocean: "#0e4d6e",
  teal: "#1a8a7d",
  seafoam: "#3ec9a7",
  sand: "#f4efe6",
  cream: "#faf8f3",
  white: "#ffffff",
  slate: "#4a5568",
  lightSlate: "#94a3b8",
  coral: "#e85d4a",
  amber: "#d4973b",
  divider: "#e2ded6",
};

const base = {
  fontFamily: "'Newsreader', 'Georgia', serif",
  sansFont: "'DM Sans', 'Helvetica Neue', sans-serif",
};

// ─── Components ───

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            background: i <= step ? colors.teal : colors.divider,
            transition: "background 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

function Field({
  label,
  help,
  children,
  insight,
  fieldValue,
  onOpenInsight,
  suggestion,
  onSuggestionChange,
  onRemoveSuggestion,
}) {
  const showInsight = Boolean(insight && hasMeaningfulValue(fieldValue) && onOpenInsight);
  const showSuggestion = Boolean(suggestion?.active);
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <label style={{ display: "block", fontFamily: base.sansFont, fontSize: 13, fontWeight: 600, color: colors.navy, letterSpacing: "0.02em" }}>
          {label}
        </label>
        {showInsight && (
          <button
            type="button"
            onClick={() => onOpenInsight(label)}
            aria-label={`Show estimate details for ${label}`}
            title="Show estimate details"
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: `1px solid ${colors.teal}66`,
              background: "#ecfeff",
              color: colors.teal,
              fontFamily: base.sansFont,
              fontSize: 11,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ?
          </button>
        )}
      </div>
      {help && <p style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.lightSlate, margin: "0 0 8px", lineHeight: 1.5 }}>{help}</p>}
      {children}
      {showSuggestion && (
        <div style={{ marginTop: 10, border: `1px solid ${colors.divider}`, borderRadius: 8, background: "#f8fafc", padding: "10px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 8 }}>
            <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate }}>
              Our suggestion (You may edit it or remove the suggestion entirely by clicking the "x"):
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {showInsight && (
                <button
                  type="button"
                  onClick={() => onOpenInsight(label)}
                  aria-label={`Show estimate details for ${label}`}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: `1px solid ${colors.teal}66`,
                    background: "#ecfeff",
                    color: colors.teal,
                    fontFamily: base.sansFont,
                    fontSize: 11,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  ?
                </button>
              )}
              <button
                type="button"
                onClick={onRemoveSuggestion}
                aria-label={`Remove suggestion for ${label}`}
                style={{
                  border: "none",
                  background: "transparent",
                  color: colors.lightSlate,
                  fontFamily: base.sansFont,
                  fontSize: 16,
                  lineHeight: 1,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
          </div>
          <textarea
            value={suggestion.text || ""}
            onChange={(event) => onSuggestionChange?.(event.target.value)}
            rows={2}
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.5,
              minHeight: 64,
              background: colors.white,
            }}
          />
        </div>
      )}
    </div>
  );
}

function LoadingOverlay({ progress = 0, stage = "thinking", message = "Estimating missing values..." }) {
  const normalizedProgress = Math.max(0, Math.min(progress, 100));
  const stageLabel = String(stage || "thinking")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7, 19, 34, 0.5)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
      }}
    >
      <style>{`
        @keyframes swell-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: "min(420px, 92vw)",
          borderRadius: 10,
          background: colors.white,
          border: `1px solid ${colors.divider}`,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          padding: "24px 22px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: `3px solid ${colors.divider}`,
            borderTopColor: colors.teal,
            margin: "0 auto 14px",
            animation: "swell-spin 0.9s linear infinite",
          }}
        />
        <div style={{ fontFamily: base.sansFont, fontSize: 15, fontWeight: 700, color: colors.navy, marginBottom: 6 }}>
          Swell is working: {stageLabel}
        </div>
        <p style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, margin: "0 0 12px", lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ width: "100%", height: 8, borderRadius: 999, background: "#e2e8f0", overflow: "hidden", marginBottom: 8 }}>
          <div
            style={{
              width: `${normalizedProgress}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${colors.teal} 0%, ${colors.seafoam} 100%)`,
              transition: "width 0.35s ease",
            }}
          />
        </div>
        <div style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate }}>
          {normalizedProgress}% complete
        </div>
      </div>
    </div>
  );
}

function FieldInsightModal({ label, insight, onClose }) {
  if (!insight) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        background: "rgba(7, 19, 34, 0.45)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(560px, 96vw)",
          maxHeight: "85vh",
          overflowY: "auto",
          borderRadius: 10,
          background: colors.white,
          border: `1px solid ${colors.divider}`,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          padding: "16px 18px 18px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: base.sansFont, fontSize: 10, fontWeight: 700, color: colors.lightSlate, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Estimated Field Insight
            </div>
            <div style={{ fontFamily: base.sansFont, fontSize: 15, fontWeight: 700, color: colors.navy }}>{label}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close estimate details"
            style={{
              border: "none",
              background: "transparent",
              color: colors.lightSlate,
              fontFamily: base.sansFont,
              fontSize: 18,
              lineHeight: 1,
              cursor: "pointer",
              padding: "0 2px",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ fontFamily: base.sansFont, fontSize: 11, fontWeight: 700, color: colors.teal, background: "#ecfeff", border: `1px solid ${colors.teal}33`, borderRadius: 999, padding: "4px 10px" }}>
            Confidence: {insight.confidence}
          </span>
          <span style={{ fontFamily: base.sansFont, fontSize: 11, fontWeight: 700, color: colors.ocean, background: "#f0f9ff", border: `1px solid ${colors.ocean}33`, borderRadius: 999, padding: "4px 10px" }}>
            Range: {insight.rangeLabel}
          </span>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ border: `1px solid ${colors.divider}`, borderRadius: 8, padding: "10px 12px", background: "#f8fafc" }}>
            <div style={{ fontFamily: base.sansFont, fontSize: 11, fontWeight: 700, color: colors.navy, marginBottom: 6 }}>Reasoning</div>
            {insight.reasoningBullets.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {insight.reasoningBullets.map((bullet, index) => (
                  <li key={index} style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, lineHeight: 1.6, marginBottom: 4 }}>{bullet}</li>
                ))}
              </ul>
            ) : (
              <p style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.lightSlate, margin: 0 }}>No reasoning provided.</p>
            )}
          </div>
          <div style={{ border: `1px solid ${colors.divider}`, borderRadius: 8, padding: "10px 12px", background: "#f8fafc" }}>
            <div style={{ fontFamily: base.sansFont, fontSize: 11, fontWeight: 700, color: colors.navy, marginBottom: 6 }}>Assumptions</div>
            {insight.assumptions.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {insight.assumptions.map((assumption, index) => (
                  <li key={index} style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, lineHeight: 1.6, marginBottom: 4 }}>{assumption}</li>
                ))}
              </ul>
            ) : (
              <p style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.lightSlate, margin: 0 }}>No assumptions provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  fontFamily: base.sansFont,
  fontSize: 14,
  border: `1px solid ${colors.divider}`,
  borderRadius: 6,
  background: colors.white,
  color: colors.navy,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };

function Input({ value, onChange, placeholder, type = "text", ...rest }) {
  return <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} {...rest} />;
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
      <option value="">{placeholder || "Select..."}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />;
}

function CheckGroup({ items, selected, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item) => (
        <label key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: base.sansFont, fontSize: 13, color: colors.slate, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={!!selected?.[item.id]}
            onChange={(e) => onChange({ ...selected, [item.id]: e.target.checked })}
            style={{ accentColor: colors.teal, width: 16, height: 16, cursor: "pointer" }}
          />
          {item.label}
        </label>
      ))}
    </div>
  );
}

function RiskGrid({ risks, values, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {risks.map((r) => (
        <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${colors.divider}` }}>
          <div>
            <span style={{ fontFamily: base.sansFont, fontSize: 13, color: colors.navy }}>{r.label}</span>
            <span style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate, display: "block" }}>{r.help}</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {RISK_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onChange({ ...values, [r.id]: lvl })}
                style={{
                  padding: "4px 10px",
                  fontFamily: base.sansFont,
                  fontSize: 11,
                  fontWeight: 500,
                  border: "1px solid",
                  borderColor: values?.[r.id] === lvl
                    ? lvl === "High" ? colors.coral : lvl === "Medium" ? colors.amber : lvl === "Low" ? colors.teal : colors.lightSlate
                    : colors.divider,
                  borderRadius: 4,
                  cursor: "pointer",
                  background: values?.[r.id] === lvl
                    ? lvl === "High" ? "#fef2f2" : lvl === "Medium" ? "#fffbeb" : lvl === "Low" ? "#ecfdf5" : "#f8fafc"
                    : colors.white,
                  color: values?.[r.id] === lvl
                    ? lvl === "High" ? colors.coral : lvl === "Medium" ? colors.amber : lvl === "Low" ? colors.teal : colors.lightSlate
                    : colors.lightSlate,
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Step Forms ───

function StepFundamentals({ data, update, getFieldMeta, getSuggestionMeta }) {
  return (
    <>
      <Field label="Project Name"><Input value={data.projectName} onChange={(v) => update("projectName", v)} placeholder="e.g. Mahakam Delta Mangrove Restoration" /></Field>
      <Field label="Sector" {...getSuggestionMeta("sector")}><Select value={data.sector} onChange={(v) => update("sector", v)} options={SECTORS} /></Field>
      <Field label="Country / Region" {...getSuggestionMeta("region")}><Select value={data.region} onChange={(v) => update("region", v)} options={REGIONS} /></Field>
      <Field label="Country"><Input value={data.country} onChange={(v) => update("country", v)} placeholder="e.g. Indonesia" /></Field>
      <Field label="Development Stage" {...getSuggestionMeta("stage")}><Select value={data.stage} onChange={(v) => update("stage", v)} options={STAGES} /></Field>
      <Field label="Total Capital Requirement (USD)" {...getFieldMeta("totalCapital")}><Input value={data.totalCapital} onChange={(v) => update("totalCapital", v)} placeholder="e.g. 15000000" /></Field>
      <Field label="Construction Period (months)" {...getFieldMeta("constructionMonths")}><Input value={data.constructionMonths} onChange={(v) => update("constructionMonths", v)} placeholder="e.g. 24" type="number" /></Field>
      <Field label="Expected Project Life (years)" {...getFieldMeta("projectLife")}><Input value={data.projectLife} onChange={(v) => update("projectLife", v)} placeholder="e.g. 20" type="number" /></Field>
      <Field label="Brief Project Description" {...getFieldMeta("description")}><TextArea value={data.description} onChange={(v) => update("description", v)} placeholder="1–2 paragraph description of the project, its objectives, and expected outcomes." rows={4} /></Field>
    </>
  );
}

function StepRevenue({ data, update, getFieldMeta, getSuggestionMeta }) {
  return (
    <>
      <Field label="Select all applicable revenue streams" help="Blue economy projects often have stacked revenue models. Select all that apply." {...getSuggestionMeta("revenueStreams")}>
        <CheckGroup items={REVENUE_STREAMS} selected={data.revenueStreams} onChange={(v) => update("revenueStreams", v)} />
      </Field>
      {data.revenueStreams?.carbon && (
        <>
          <Field label="Carbon Credit Methodology"><Select value={data.carbonMethodology} onChange={(v) => update("carbonMethodology", v)} options={CARBON_METHODOLOGIES} /></Field>
          <Field label="Estimated Annual Carbon Yield (tCO₂e)"><Input value={data.carbonYield} onChange={(v) => update("carbonYield", v)} placeholder="e.g. 50000" /></Field>
          <Field label="Assumed Carbon Price (USD/tCO₂e)" help="Market range: $20–30/tCO₂e for blue carbon (2023–24 VCM data). IFC estimates $15–35 for mangrove credits."><Input value={data.carbonPrice} onChange={(v) => update("carbonPrice", v)} placeholder="e.g. 25 (VCM avg ~$26)" /></Field>
        </>
      )}
      {data.revenueStreams?.offtake && (
        <Field label="Offtake Details" help="Describe the offtake arrangement: buyer, volume, pricing, contract tenor.">
          <TextArea value={data.offtakeDetails} onChange={(v) => update("offtakeDetails", v)} placeholder="e.g. 5-year offtake agreement with XXX for 2,000 tonnes/year at $X/kg" />
        </Field>
      )}
      <Field label="Primary Revenue Stream" help="Which revenue stream is expected to contribute the largest share?" {...getFieldMeta("primaryRevenue")} {...getSuggestionMeta("primaryRevenue")}>
        <Select value={data.primaryRevenue} onChange={(v) => update("primaryRevenue", v)} options={REVENUE_STREAMS.filter((r) => data.revenueStreams?.[r.id]).map((r) => r.label)} placeholder="Select primary..." />
      </Field>
      <Field label="Estimated Annual Revenue at Steady State (USD)" {...getFieldMeta("annualRevenue")}><Input value={data.annualRevenue} onChange={(v) => update("annualRevenue", v)} placeholder="e.g. 3500000" /></Field>
    </>
  );
}

function StepRisk({ data, update, getFieldMeta }) {
  return (
    <>
      <Field label="Assess each risk dimension" help="Rate each risk factor for your project. These determine the risk allocation provisions and first-loss requirements in the term sheet.">
        <RiskGrid risks={RISK_ITEMS} values={data.risks} onChange={(v) => update("risks", v)} />
      </Field>
      <Field label="Additional risk notes" help="Any context on key risks that an investor should understand." {...getFieldMeta("riskNotes")}>
        <TextArea value={data.riskNotes} onChange={(v) => update("riskNotes", v)} placeholder="e.g. Marine tenure secured via 30-year concession from Ministry of Forestry..." />
      </Field>
    </>
  );
}

function StepCapital({ data, update, getFieldMeta, getSuggestionMeta }) {
  const concPct = parseFloat(data.concessionalPct) || 25;
  const mezzPct = parseFloat(data.mezzaninePct) || 35;
  const seniorPct = Math.max(0, 100 - concPct - mezzPct);
  const equityPct = parseFloat(data.sponsorEquity) || 0;
  const totalCap = parseFloat((data.totalCapital || "0").replace(/,/g, "")) || 0;
  const equityAmt = totalCap * (equityPct / 100);
  const totalDebt = totalCap - equityAmt;
  const dfiTerms = data.dfiSource ? DFI_TERMS[data.dfiSource] : null;
  return (
    <>
      <Field label="Equity Contribution from Sponsor (%)" help="How much equity will the project sponsor contribute? This is deducted from the total project cost first — the remaining amount is split across debt tranches below." {...getFieldMeta("sponsorEquity")}>
        <Input value={data.sponsorEquity} onChange={(v) => update("sponsorEquity", v)} placeholder="e.g. 10" type="number" />
      </Field>
      {equityPct > 0 && totalCap > 0 && (
        <div style={{ padding: "10px 16px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${colors.divider}`, marginBottom: 16 }}>
          <span style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate }}>
            Total project cost: <strong>{fmt(totalCap)}</strong> · Sponsor equity: <strong>{fmt(equityAmt)}</strong> ({equityPct}%) · <strong>Debt to structure: {fmt(totalDebt)}</strong>
          </span>
        </div>
      )}
      <Field label="Concessional / Catalytic Tranche (% of debt)" help="First-loss capital from DFIs, GCF, philanthropy. Percentage of total debt (after equity), not total project cost." {...getFieldMeta("concessionalPct")}>
        <Input value={data.concessionalPct} onChange={(v) => update("concessionalPct", v)} placeholder="e.g. 25" type="number" />
      </Field>
      <Field label="Mezzanine / Impact Tranche (% of debt)" help="Impact investor capital. Higher return than concessional, subordinate to senior debt. Percentage of total debt." {...getFieldMeta("mezzaninePct")}>
        <Input value={data.mezzaninePct} onChange={(v) => update("mezzaninePct", v)} placeholder="e.g. 35" type="number" />
      </Field>
      <div style={{ padding: "12px 16px", background: "#f0fdfa", borderRadius: 8, border: `1px solid ${colors.teal}33`, marginBottom: 24 }}>
        <span style={{ fontFamily: base.sansFont, fontSize: 13, color: colors.ocean }}>
          Senior Commercial Tranche: <strong>{seniorPct}%</strong> of debt (auto-calculated)
        </span>
        {totalDebt > 0 && (
          <span style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate, display: "block", marginTop: 4 }}>
            Concessional: {fmt(totalDebt * concPct / 100)} · Mezzanine: {fmt(totalDebt * mezzPct / 100)} · Senior: {fmt(totalDebt * seniorPct / 100)}
          </span>
        )}
      </div>
      <Field label="Identified DFI / Concessional Source" {...getFieldMeta("dfiSource")} {...getSuggestionMeta("dfiSource")}><Select value={data.dfiSource} onChange={(v) => update("dfiSource", v)} options={DFI_SOURCES} /></Field>
      {dfiTerms && (
        <div style={{ padding: "16px 18px", background: "#f0f7fa", borderRadius: 8, border: `1px solid ${colors.ocean}33`, marginBottom: 24 }}>
          <div style={{ fontFamily: base.sansFont, fontSize: 11, fontWeight: 700, color: colors.ocean, marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Auto-populated indicative terms — {data.dfiSource}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
            <div>
              <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, display: "block" }}>Interest Rate</span>
              <span style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.navy, fontWeight: 600 }}>{dfiTerms.rate}</span>
            </div>
            <div>
              <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, display: "block" }}>Instrument</span>
              <span style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.navy, fontWeight: 600 }}>{dfiTerms.instrument}</span>
            </div>
            <div>
              <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, display: "block" }}>Grace Period</span>
              <span style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.navy, fontWeight: 600 }}>{dfiTerms.grace}</span>
            </div>
            <div>
              <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, display: "block" }}>Maturity</span>
              <span style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.navy, fontWeight: 600 }}>{dfiTerms.maturity}</span>
            </div>
          </div>
          <p style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.slate, margin: "10px 0 4px", lineHeight: 1.5 }}>{dfiTerms.note}</p>
          <p style={{ fontFamily: base.sansFont, fontSize: 9, color: colors.lightSlate, margin: 0, fontStyle: "italic" }}>Source: {dfiTerms.source}</p>
        </div>
      )}
      <Field label="DFI Engagement Status" help="Have you had any contact with a DFI about this project?" {...getFieldMeta("dfiStatus")} {...getSuggestionMeta("dfiStatus")}>
        <Select value={data.dfiStatus} onChange={(v) => update("dfiStatus", v)} options={["No contact yet", "Informal discussion", "Formal expression of interest", "Term sheet / commitment in place"]} />
      </Field>
      <Field label="Credit Enhancement Structure" help="How will the deal be de-risked for senior lenders? Select the primary credit enhancement mechanism." {...getFieldMeta("creditEnhancement")} {...getSuggestionMeta("creditEnhancement")}>
        <Select value={data.creditEnhancement} onChange={(v) => update("creditEnhancement", v)} options={CREDIT_ENHANCEMENT_TYPES} />
      </Field>
      {data.creditEnhancement && CREDIT_ENHANCEMENT_DETAILS[data.creditEnhancement] && (() => {
        const ce = CREDIT_ENHANCEMENT_DETAILS[data.creditEnhancement];
        return (
          <div style={{ padding: "16px 18px", background: "#faf8f3", borderRadius: 8, border: `1px solid ${colors.amber}33`, marginBottom: 24 }}>
            <div style={{ fontFamily: base.sansFont, fontSize: 11, fontWeight: 700, color: colors.amber, marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {data.creditEnhancement}
            </div>
            <p style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, lineHeight: 1.6, margin: "0 0 12px" }}>
              {ce.description}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 12 }}>
              <div>
                <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, display: "block" }}>Typical Provider</span>
                <span style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.navy, fontWeight: 600 }}>{ce.typicalProvider}</span>
              </div>
              <div>
                <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, display: "block" }}>Typical Coverage</span>
                <span style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.navy, fontWeight: 600 }}>{ce.typicalCoverage}</span>
              </div>
              <div>
                <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, display: "block" }}>Indicative Cost</span>
                <span style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.navy, fontWeight: 600 }}>{ce.costIndicative}</span>
              </div>
              <div>
                <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, display: "block" }}>Rating Impact</span>
                <span style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.navy, fontWeight: 600 }}>{ce.ratingImpact}</span>
              </div>
            </div>
            <div style={{ padding: "10px 12px", background: colors.white, borderRadius: 4, border: `1px solid ${colors.divider}`, marginBottom: 8 }}>
              <span style={{ fontFamily: base.sansFont, fontSize: 10, fontWeight: 600, color: colors.ocean, display: "block", marginBottom: 4 }}>Blue economy precedent:</span>
              <p style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.slate, lineHeight: 1.6, margin: 0 }}>{ce.precedent}</p>
            </div>
          </div>
        );
      })()}
      <Field label="Preferred Capital Structure Notes" {...getFieldMeta("capitalNotes")}><TextArea value={data.capitalNotes} onChange={(v) => update("capitalNotes", v)} placeholder="Any preferences on structure, existing commitments, or constraints." /></Field>
    </>
  );
}

function StepImpact({ data, update, getFieldMeta, getSuggestionMeta }) {
  return (
    <>
      <Field label="Select impact metrics this project will report on" {...getSuggestionMeta("impactMetrics")}>
        <CheckGroup items={IMPACT_METRICS} selected={data.impactMetrics} onChange={(v) => update("impactMetrics", v)} />
      </Field>
      <Field label="MRV Status" {...getFieldMeta("mrvStatus")} {...getSuggestionMeta("mrvStatus")}><Select value={data.mrvStatus} onChange={(v) => update("mrvStatus", v)} options={MRV_STATUS} /></Field>
      <Field label="Third-party Verifier" help="If identified" {...getFieldMeta("verifier")}><Input value={data.verifier} onChange={(v) => update("verifier", v)} placeholder="e.g. SCS Global Services, Aster Global" /></Field>
      <Field label="Impact-linked Return Mechanism" help="Should investor returns be tied to verified impact outcomes?" {...getFieldMeta("impactLinked")} {...getSuggestionMeta("impactLinked")}>
        <Select value={data.impactLinked} onChange={(v) => update("impactLinked", v)} options={["Yes — returns partially indexed to impact KPIs", "No — standard fixed return structure", "Open to discussion"]} />
      </Field>
      <Field label="SDG Alignment" help="Beyond SDG 14, which SDGs does this project contribute to?" {...getFieldMeta("sdgAlignment")}>
        <TextArea value={data.sdgAlignment} onChange={(v) => update("sdgAlignment", v)} placeholder="e.g. SDG 13 (Climate Action), SDG 8 (Decent Work), SDG 1 (No Poverty)" />
      </Field>
    </>
  );
}

function StepGovernance({ data, update, getFieldMeta, getSuggestionMeta }) {
  const fileInputRef = useRef(null);
  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files || []).map((f) => ({
      name: f.name,
      size: (f.size / 1024).toFixed(0) + " KB",
      type: f.name.split(".").pop().toUpperCase(),
      category: "Other",
      id: Date.now() + Math.random(),
    }));
    update("attachedFiles", [...(data.attachedFiles || []), ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeFile = (id) => {
    update("attachedFiles", (data.attachedFiles || []).filter((f) => f.id !== id));
  };
  const updateFileCategory = (id, category) => {
    update("attachedFiles", (data.attachedFiles || []).map((f) => f.id === id ? { ...f, category } : f));
  };
  const FILE_CATEGORIES = [
    "Financial model / projections",
    "Environmental Impact Assessment (EIA)",
    "MRV methodology document",
    "Offtake / purchase agreement",
    "Land or marine tenure documentation",
    "Corporate / SPV registration",
    "Pitch deck / investor presentation",
    "Letters of interest (DFI / investor)",
    "Insurance / guarantee term sheet",
    "Carbon credit feasibility study",
    "Community engagement plan",
    "Other",
  ];

  return (
    <>
      <Field label="Project Company / SPV Name" {...getFieldMeta("spvName")}><Input value={data.spvName} onChange={(v) => update("spvName", v)} placeholder="e.g. PT Mahakam Blue Carbon Ltd." /></Field>
      <Field label="Sponsor / Developer Entity" {...getFieldMeta("sponsorEntity")}><Input value={data.sponsorEntity} onChange={(v) => update("sponsorEntity", v)} placeholder="e.g. Blue Horizon Development Corp" /></Field>
      <Field label="Jurisdiction of Incorporation" {...getFieldMeta("jurisdiction")}><Input value={data.jurisdiction} onChange={(v) => update("jurisdiction", v)} placeholder="e.g. Singapore" /></Field>
      <Field label="Reporting Cadence" {...getFieldMeta("reportingCadence")} {...getSuggestionMeta("reportingCadence")}><Select value={data.reportingCadence} onChange={(v) => update("reportingCadence", v)} options={["Monthly", "Quarterly", "Semi-annually", "Annually"]} /></Field>
      <Field label="Target Financial Close" {...getFieldMeta("targetClose")}><Input value={data.targetClose} onChange={(v) => update("targetClose", v)} placeholder="e.g. Q4 2026" /></Field>
      <Field label="Conditions Precedent" help="Key milestones required before disbursement." {...getFieldMeta("conditionsPrecedent")}>
        <TextArea value={data.conditionsPrecedent} onChange={(v) => update("conditionsPrecedent", v)} placeholder="e.g. Environmental permits secured, offtake agreement executed, MRV methodology validated..." rows={3} />
      </Field>
      <Field label="Key Team Members" help="Names and roles of the project leadership team." {...getFieldMeta("teamMembers")}>
        <TextArea value={data.teamMembers} onChange={(v) => update("teamMembers", v)} placeholder="e.g. Jane Doe — CEO (15 yrs marine conservation); John Smith — CFO (ex-IFC project finance)" rows={3} />
      </Field>

      {/* File Upload Section */}
      <Field label="Supporting Documents" help="Attach key project documents. These will be referenced in the term sheet's conditions precedent and due diligence checklist.">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = colors.teal; }}
          onDragLeave={(e) => { e.currentTarget.style.borderColor = colors.divider; }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.borderColor = colors.divider;
            const newFiles = Array.from(e.dataTransfer.files).map((f) => ({
              name: f.name,
              size: (f.size / 1024).toFixed(0) + " KB",
              type: f.name.split(".").pop().toUpperCase(),
              category: "Other",
              id: Date.now() + Math.random(),
            }));
            update("attachedFiles", [...(data.attachedFiles || []), ...newFiles]);
          }}
          style={{
            border: `2px dashed ${colors.divider}`,
            borderRadius: 8,
            padding: "24px 16px",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
            background: colors.white,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFiles}
            style={{ display: "none" }}
          />
          <div style={{ fontFamily: base.sansFont, fontSize: 22, color: colors.lightSlate, marginBottom: 4 }}>+</div>
          <div style={{ fontFamily: base.sansFont, fontSize: 13, color: colors.ocean, fontWeight: 600, marginBottom: 4 }}>
            Drop files here or click to browse
          </div>
          <div style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate }}>
            PDF, DOCX, XLSX, PPTX, or any document type
          </div>
        </div>
      </Field>

      {(data.attachedFiles || []).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: base.sansFont, fontSize: 12, fontWeight: 600, color: colors.navy, marginBottom: 8 }}>
            {data.attachedFiles.length} document{data.attachedFiles.length !== 1 ? "s" : ""} attached
          </div>
          {data.attachedFiles.map((f) => (
            <div key={f.id} style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto auto",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: colors.white,
              border: `1px solid ${colors.divider}`,
              borderRadius: 6,
              marginBottom: 6,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 4,
                background: f.type === "PDF" ? "#fee2e2" : f.type === "XLSX" ? "#dcfce7" : f.type === "DOCX" ? "#dbeafe" : f.type === "PPTX" ? "#fef3c7" : "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: base.sansFont, fontSize: 8, fontWeight: 700,
                color: f.type === "PDF" ? "#dc2626" : f.type === "XLSX" ? "#16a34a" : f.type === "DOCX" ? "#2563eb" : f.type === "PPTX" ? "#d97706" : colors.slate,
              }}>
                {f.type}
              </div>
              <div>
                <div style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.navy, fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate }}>{f.size}</div>
              </div>
              <select
                value={f.category}
                onChange={(e) => updateFileCategory(f.id, e.target.value)}
                style={{
                  fontFamily: base.sansFont, fontSize: 10, padding: "4px 8px",
                  border: `1px solid ${colors.divider}`, borderRadius: 4,
                  color: colors.slate, background: colors.white, cursor: "pointer",
                }}
              >
                {FILE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                onClick={() => removeFile(f.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: base.sansFont, fontSize: 14, color: colors.lightSlate,
                  padding: "2px 6px", borderRadius: 4,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Term Sheet Output ───

function TermSheetOutput({ data }) {
  const ts = generateTermSheet(data);
  const ref = useRef(null);

  const sectionHead = {
    fontFamily: base.sansFont,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.teal,
    marginBottom: 12,
    marginTop: 32,
    paddingBottom: 6,
    borderBottom: `2px solid ${colors.teal}`,
  };

  const tableStyle = { width: "100%", borderCollapse: "collapse", marginBottom: 8 };
  const th = { fontFamily: base.sansFont, fontSize: 11, fontWeight: 600, color: colors.ocean, textAlign: "left", padding: "8px 12px", background: "#f0f7fa", borderBottom: `1px solid ${colors.divider}` };
  const td = { fontFamily: base.sansFont, fontSize: 12, color: colors.navy, padding: "8px 12px", borderBottom: `1px solid ${colors.divider}`, lineHeight: 1.5 };

  return (
    <div style={{ background: colors.white, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ padding: "48px 48px 24px", borderBottom: `3px solid ${colors.navy}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: base.sansFont, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: colors.teal }}>
            Confidential — Draft Term Sheet
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <SwellLogo size={12} />
            <span style={{ fontFamily: base.sansFont, fontSize: 10, fontWeight: 700, color: colors.ocean, letterSpacing: "0.06em" }}>SWELL</span>
          </div>
        </div>
        <h1 style={{ fontFamily: base.fontFamily, fontSize: 28, fontWeight: 700, color: colors.navy, margin: "0 0 8px", lineHeight: 1.2 }}>
          {data.projectName || "Untitled Project"}
        </h1>
        <p style={{ fontFamily: base.sansFont, fontSize: 13, color: colors.slate, margin: 0 }}>
          {data.sector} · {data.country || data.region} · {fmt(ts.totalCap)} Blended Finance Facility
        </p>
        <p style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate, margin: "8px 0 0" }}>
          Generated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · For discussion purposes only
        </p>
      </div>

      <div ref={ref} style={{ padding: "16px 48px 48px" }}>
        {/* Transaction Summary */}
        <div style={sectionHead}>1. Transaction Summary</div>
        <p style={{ fontFamily: base.fontFamily, fontSize: 13, color: colors.slate, lineHeight: 1.8, margin: "0 0 16px" }}>
          {data.sponsorEntity || "[Sponsor]"} (the "Sponsor") proposes a {fmt(ts.totalCap)} blended finance facility
          to fund the development and operation of {data.projectName || "[Project Name]"}, a {data.sector?.toLowerCase()} project
          located in {data.country || data.region || "[Location]"}. The facility will have a {data.projectLife || "[X]"}-year tenor
          with a {data.constructionMonths || "[X]"}-month construction period. The project is currently at
          the {data.stage?.toLowerCase() || "[stage]"} stage of development.
        </p>
        {data.description && (
          <p style={{ fontFamily: base.fontFamily, fontSize: 13, color: colors.slate, lineHeight: 1.8, margin: "0 0 16px" }}>
            {data.description}
          </p>
        )}

        {/* Capital Structure */}
        <div style={sectionHead}>2. Capital Structure</div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th}>Tranche</th>
              <th style={th}>Amount</th>
              <th style={th}>% of Project</th>
              <th style={th}>Indicative Terms</th>
            </tr>
          </thead>
          <tbody>
            {ts.equityPct > 0 && (
              <tr>
                <td style={{ ...td, fontWeight: 600 }}>Sponsor Equity</td>
                <td style={td}>{fmt(ts.equityAmt)}</td>
                <td style={td}>{pct(ts.equityPct)}</td>
                <td style={td}>Common equity, subordinate to all debt tranches</td>
              </tr>
            )}
            <tr style={{ background: "#f8faf9" }}>
              <td style={{ ...td, fontWeight: 600, fontStyle: "italic", color: colors.ocean }}>Total Debt</td>
              <td style={{ ...td, fontStyle: "italic", color: colors.ocean }}>{fmt(ts.totalDebt)}</td>
              <td style={{ ...td, fontStyle: "italic", color: colors.ocean }}>{pct(100 - ts.equityPct)}</td>
              <td style={{ ...td, fontStyle: "italic", color: colors.lightSlate, fontSize: 10 }}>Split across tranches below (% of debt)</td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight: 600, paddingLeft: 24 }}>Concessional / Catalytic</td>
              <td style={td}>{fmt(ts.concAmt)}</td>
              <td style={td}>{pct(ts.concPct)} of debt</td>
              <td style={td}>{DFI_TERMS[data.dfiSource] ? `${DFI_TERMS[data.dfiSource].rate}, ${DFI_TERMS[data.dfiSource].grace} grace, ${DFI_TERMS[data.dfiSource].maturity} maturity` : ts.tmpl.concTerms}</td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight: 600, paddingLeft: 24 }}>Mezzanine / Impact</td>
              <td style={td}>{fmt(ts.mezzAmt)}</td>
              <td style={td}>{pct(ts.mezzPct)} of debt</td>
              <td style={td}>Target {ts.tmpl.mezzReturn}</td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight: 600, paddingLeft: 24 }}>Senior Commercial Debt</td>
              <td style={td}>{fmt(ts.seniorAmt)}</td>
              <td style={td}>{pct(ts.seniorPct)} of debt</td>
              <td style={td}>{ts.tmpl.seniorRate}, {ts.tmpl.typicalTenor} tenor</td>
            </tr>
            <tr style={{ background: "#f0f7fa" }}>
              <td style={{ ...td, fontWeight: 700 }}>Total Project Cost</td>
              <td style={{ ...td, fontWeight: 700 }}>{fmt(ts.totalCap)}</td>
              <td style={{ ...td, fontWeight: 700 }}>100%</td>
              <td style={td}></td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate, margin: "4px 0 0" }}>
          Target DSCR (senior tranche): {ts.tmpl.typicalDSCR} · Concessional source: {data.dfiSource || "TBD"} ({data.dfiStatus || "status TBD"})
          {DFI_TERMS[data.dfiSource] && ` · Instrument: ${DFI_TERMS[data.dfiSource].instrument}`}
        </p>
        {DFI_TERMS[data.dfiSource] && (
          <p style={{ fontFamily: base.sansFont, fontSize: 9, color: colors.lightSlate, margin: "4px 0 0", fontStyle: "italic" }}>
            DFI terms source: {DFI_TERMS[data.dfiSource].source}
          </p>
        )}
        <p style={{ fontFamily: base.sansFont, fontSize: 9, color: colors.lightSlate, margin: "4px 0 0", fontStyle: "italic" }}>
          Note on senior pricing: Indicative project-level rate reflects SPV borrower risk in SIDS/emerging markets. The only closed blue economy senior debt precedent (Seychelles Blue Bond, 2018) was priced at 6.5% — but this was sovereign credit (Government of Seychelles as borrower), not project-level. Credit enhancement can significantly reduce the effective senior rate by improving the tranche credit profile. Seychelles effective rate was blended to ~2.8% via GEF concessional subsidy.
        </p>

        {/* Credit Enhancement */}
        {data.creditEnhancement && CREDIT_ENHANCEMENT_DETAILS[data.creditEnhancement] && (() => {
          const ce = CREDIT_ENHANCEMENT_DETAILS[data.creditEnhancement];
          return (
            <>
              <div style={{ marginTop: 20, padding: "16px 18px", background: "#fefcf8", borderRadius: 6, border: `1px solid ${colors.amber}33` }}>
                <div style={{ fontFamily: base.sansFont, fontSize: 10, fontWeight: 700, color: colors.amber, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                  Credit Enhancement: {data.creditEnhancement}
                </div>
                <p style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.slate, lineHeight: 1.6, margin: "0 0 10px" }}>
                  <strong>Mechanism:</strong> {ce.mechanism}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div>
                    <span style={{ fontFamily: base.sansFont, fontSize: 9, color: colors.lightSlate, display: "block" }}>Provider</span>
                    <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.navy }}>{ce.typicalProvider}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: base.sansFont, fontSize: 9, color: colors.lightSlate, display: "block" }}>Coverage</span>
                    <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.navy }}>{ce.typicalCoverage}</span>
                  </div>
                  <div>
                    <span style={{ fontFamily: base.sansFont, fontSize: 9, color: colors.lightSlate, display: "block" }}>Rating Impact</span>
                    <span style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.navy }}>{ce.ratingImpact}</span>
                  </div>
                </div>
                <div style={{ padding: "8px 10px", background: colors.white, borderRadius: 4, border: `1px solid ${colors.divider}`, marginBottom: 8 }}>
                  <span style={{ fontFamily: base.sansFont, fontSize: 9, fontWeight: 600, color: colors.ocean, display: "block", marginBottom: 3 }}>Indicative term sheet language:</span>
                  <p style={{ fontFamily: base.fontFamily, fontSize: 10, color: colors.slate, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{ce.termSheetLanguage}</p>
                </div>
                <p style={{ fontFamily: base.sansFont, fontSize: 9, color: colors.lightSlate, margin: 0, fontStyle: "italic" }}>
                  Precedent: {ce.precedent}
                </p>
              </div>
            </>
          );
        })()}

        {/* Revenue Waterfall */}
        <div style={sectionHead}>3. Revenue Structure & Waterfall</div>
        <p style={{ fontFamily: base.fontFamily, fontSize: 13, color: colors.slate, lineHeight: 1.8, margin: "0 0 12px" }}>
          Estimated annual revenue at steady state: {fmt(data.annualRevenue)}. Primary revenue stream: {data.primaryRevenue || "TBD"}.
        </p>
        <table style={tableStyle}>
          <thead>
            <tr><th style={th}>Priority</th><th style={th}>Application</th></tr>
          </thead>
          <tbody>
            <tr><td style={td}>1</td><td style={td}>Operating expenses & maintenance reserves</td></tr>
            <tr><td style={td}>2</td><td style={td}>Senior debt service (interest + principal)</td></tr>
            <tr><td style={td}>3</td><td style={td}>Debt service reserve account (DSRA) top-up — 6 months senior debt service (Belize precedent: 24-month DSRA)</td></tr>
            <tr><td style={td}>4</td><td style={td}>Mezzanine / impact tranche service</td></tr>
            <tr><td style={td}>5</td><td style={td}>Concessional tranche service (if applicable)</td></tr>
            <tr><td style={td}>6</td><td style={td}>Community benefit-sharing / impact-linked payments</td></tr>
            <tr><td style={td}>7</td><td style={td}>Residual cash flow to sponsor equity</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontFamily: base.sansFont, fontSize: 12, fontWeight: 600, color: colors.ocean }}>Active revenue streams:</span>
          <ul style={{ margin: "6px 0", paddingLeft: 20 }}>
            {ts.activeRevenue.map((r) => (
              <li key={r.id} style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, marginBottom: 4 }}>{r.label}</li>
            ))}
          </ul>
        </div>
        {data.revenueStreams?.carbon && (
          <div style={{ margin: "8px 0" }}>
            <p style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, margin: "0 0 6px" }}>
              Carbon credit revenue: {data.carbonYield || "—"} tCO₂e/yr × ${data.carbonPrice || "—"}/tCO₂e = {fmt((parseFloat(data.carbonYield) || 0) * (parseFloat(data.carbonPrice) || 0))}/yr estimated.
              Methodology: {data.carbonMethodology || "TBD"}.
            </p>
            {ts.tmpl.carbonPriceNote && (
              <p style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, margin: "0 0 4px", fontStyle: "italic" }}>
                Pricing benchmark: {ts.tmpl.carbonPriceNote}
              </p>
            )}
            {ts.tmpl.bufferNote && (
              <p style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, margin: 0, fontStyle: "italic" }}>
                Buffer assumption: {ts.tmpl.bufferNote}
              </p>
            )}
          </div>
        )}

        {/* Risk Allocation */}
        <div style={sectionHead}>4. Risk Assessment & Allocation</div>
        <table style={tableStyle}>
          <thead>
            <tr><th style={th}>Risk Factor</th><th style={th}>Assessment</th><th style={th}>Allocation / Mitigation</th></tr>
          </thead>
          <tbody>
            {ts.activeRisks.map((r) => (
              <tr key={r.id}>
                <td style={td}>{r.label}</td>
                <td style={{
                  ...td,
                  fontWeight: 600,
                  color: r.level === "High" ? colors.coral : r.level === "Medium" ? colors.amber : r.level === "Low" ? colors.teal : colors.lightSlate,
                }}>
                  {r.level}
                </td>
                <td style={td}>
                  {r.level === "High"
                    ? "Absorbed by concessional first-loss tranche"
                    : r.level === "Medium"
                    ? "Shared across mezzanine and concessional tranches"
                    : r.level === "Low"
                    ? "Standard project company risk"
                    : "To be assessed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.riskNotes && (
          <p style={{ fontFamily: base.fontFamily, fontSize: 12, color: colors.slate, lineHeight: 1.7, margin: "8px 0", fontStyle: "italic" }}>
            {data.riskNotes}
          </p>
        )}

        {/* Impact Covenants */}
        <div style={sectionHead}>5. Impact Covenants & MRV</div>
        <p style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, marginBottom: 12 }}>
          MRV status: {data.mrvStatus || "TBD"} · Verifier: {data.verifier || "TBD"} · Impact-linked returns: {data.impactLinked || "TBD"}
        </p>
        <table style={tableStyle}>
          <thead>
            <tr><th style={th}>Impact KPI</th><th style={th}>Reporting Frequency</th><th style={th}>Verification</th></tr>
          </thead>
          <tbody>
            {ts.activeImpact.map((m) => (
              <tr key={m.id}>
                <td style={td}>{m.label}</td>
                <td style={td}>{data.reportingCadence || "Quarterly"}</td>
                <td style={td}>Third-party verified annually</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12 }}>
          <span style={{ fontFamily: base.sansFont, fontSize: 12, fontWeight: 600, color: colors.ocean }}>Financial covenants (sector-standard):</span>
          <ul style={{ margin: "6px 0", paddingLeft: 20 }}>
            {ts.tmpl.keyCovenants.map((c, i) => (
              <li key={i} style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, marginBottom: 4 }}>{c}</li>
            ))}
          </ul>
        </div>
        {data.sdgAlignment && (
          <p style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, margin: "8px 0" }}>
            SDG Alignment: SDG 14 (Life Below Water), {data.sdgAlignment}
          </p>
        )}

        {/* Governance & Conditions */}
        <div style={sectionHead}>6. Governance & Conditions Precedent</div>
        <table style={tableStyle}>
          <tbody>
            <tr><td style={{ ...td, fontWeight: 600, width: 180 }}>Project Company</td><td style={td}>{data.spvName || "TBD"}</td></tr>
            <tr><td style={{ ...td, fontWeight: 600 }}>Sponsor</td><td style={td}>{data.sponsorEntity || "TBD"}</td></tr>
            <tr><td style={{ ...td, fontWeight: 600 }}>Jurisdiction</td><td style={td}>{data.jurisdiction || "TBD"}</td></tr>
            <tr><td style={{ ...td, fontWeight: 600 }}>Reporting</td><td style={td}>{data.reportingCadence || "Quarterly"} financial and impact reporting to all tranche holders</td></tr>
            <tr><td style={{ ...td, fontWeight: 600 }}>Target Close</td><td style={td}>{data.targetClose || "TBD"}</td></tr>
          </tbody>
        </table>
        {data.conditionsPrecedent && (
          <div style={{ marginTop: 12 }}>
            <span style={{ fontFamily: base.sansFont, fontSize: 12, fontWeight: 600, color: colors.ocean }}>Conditions precedent to first disbursement:</span>
            <p style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, lineHeight: 1.7, margin: "6px 0" }}>{data.conditionsPrecedent}</p>
          </div>
        )}
        {data.teamMembers && (
          <div style={{ marginTop: 12 }}>
            <span style={{ fontFamily: base.sansFont, fontSize: 12, fontWeight: 600, color: colors.ocean }}>Key team:</span>
            <p style={{ fontFamily: base.sansFont, fontSize: 12, color: colors.slate, lineHeight: 1.7, margin: "6px 0", whiteSpace: "pre-line" }}>{data.teamMembers}</p>
          </div>
        )}

        {/* Supporting Documents */}
        {(data.attachedFiles || []).length > 0 && (
          <div style={{ marginTop: 16 }}>
            <span style={{ fontFamily: base.sansFont, fontSize: 12, fontWeight: 600, color: colors.ocean }}>Supporting documents attached ({data.attachedFiles.length}):</span>
            <table style={tableStyle}>
              <thead>
                <tr><th style={th}>Document</th><th style={th}>Category</th><th style={th}>Type</th></tr>
              </thead>
              <tbody>
                {data.attachedFiles.map((f) => (
                  <tr key={f.id}>
                    <td style={td}>{f.name}</td>
                    <td style={td}>{f.category}</td>
                    <td style={td}>{f.type} · {f.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transaction Cost Estimate */}
        {ts.txCosts && (
          <>
            <div style={sectionHead}>7. Estimated Transaction Costs</div>
            <p style={{ fontFamily: base.fontFamily, fontSize: 13, color: colors.slate, lineHeight: 1.8, margin: "0 0 16px" }}>
              Based on precedent blue economy transactions and the complexity profile of this deal, estimated structuring costs are:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div style={{ padding: "20px", background: "#fef8f0", borderRadius: 8, border: `1px solid ${colors.amber}44` }}>
                <div style={{ fontFamily: base.sansFont, fontSize: 10, fontWeight: 600, color: colors.amber, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  Bespoke structuring (no templates)
                </div>
                <div style={{ fontFamily: base.sansFont, fontSize: 24, fontWeight: 700, color: colors.navy }}>
                  {fmt(ts.txCosts.totalCost)}
                </div>
                <div style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.slate }}>
                  {ts.txCosts.totalPct}% of deal value
                </div>
              </div>
              <div style={{ padding: "20px", background: "#ecfdf5", borderRadius: 8, border: `1px solid ${colors.teal}44` }}>
                <div style={{ fontFamily: base.sansFont, fontSize: 10, fontWeight: 600, color: colors.teal, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  With standardized templates
                </div>
                <div style={{ fontFamily: base.sansFont, fontSize: 24, fontWeight: 700, color: colors.navy }}>
                  {fmt(ts.txCosts.standardizedCost)}
                </div>
                <div style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.teal, fontWeight: 600 }}>
                  Estimated savings: {fmt(ts.txCosts.savings)} ({ts.txCosts.savingsPct}% reduction)
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: base.sansFont, fontSize: 12, fontWeight: 600, color: colors.ocean }}>Estimated cost breakdown:</span>
              <table style={tableStyle}>
                <thead>
                  <tr><th style={th}>Category</th><th style={th}>Estimated Cost</th><th style={th}>% of Total</th></tr>
                </thead>
                <tbody>
                  <tr><td style={td}>Legal & documentation</td><td style={td}>{fmt(ts.txCosts.breakdown.legal)}</td><td style={td}>35%</td></tr>
                  <tr><td style={td}>Financial advisory & arrangement</td><td style={td}>{fmt(ts.txCosts.breakdown.advisory)}</td><td style={td}>25%</td></tr>
                  <tr><td style={td}>Due diligence & environmental assessment</td><td style={td}>{fmt(ts.txCosts.breakdown.dueDiligence)}</td><td style={td}>15%</td></tr>
                  {ts.txCosts.breakdown.mrvSetup > 0 && (
                    <tr><td style={td}>MRV methodology setup & validation</td><td style={td}>{fmt(ts.txCosts.breakdown.mrvSetup)}</td><td style={td}>10%</td></tr>
                  )}
                  <tr><td style={td}>Insurance & credit enhancement</td><td style={td}>{fmt(ts.txCosts.breakdown.insurance)}</td><td style={td}>{data.dfiSource?.includes("DFC") ? "10%" : "5%"}</td></tr>
                  <tr><td style={td}>Other (placement, trustee, admin)</td><td style={td}>{fmt(ts.txCosts.breakdown.other)}</td><td style={td}>{(ts.txCosts.breakdown.other / ts.txCosts.totalCost * 100).toFixed(0)}%</td></tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: 12 }}>
              <span style={{ fontFamily: base.sansFont, fontSize: 12, fontWeight: 600, color: colors.ocean }}>Complexity factors applied:</span>
              <ul style={{ margin: "6px 0", paddingLeft: 20 }}>
                <li style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.slate, marginBottom: 3 }}>Base rate: {ts.txCosts.basePct}% (based on deal size of {fmt(ts.txCosts.totalCost / (parseFloat(ts.txCosts.totalPct) / 100))})</li>
                {ts.txCosts.complexityFactors.map((f, i) => (
                  <li key={i} style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.slate, marginBottom: 3 }}>{f}</li>
                ))}
                <li style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.slate, marginBottom: 3 }}>Combined complexity multiplier: {ts.txCosts.complexityMultiplier}x → effective rate: {ts.txCosts.totalPct}%</li>
              </ul>
            </div>

            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${colors.divider}`, marginBottom: 8 }}>
              <p style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, lineHeight: 1.6, margin: 0 }}>
                <strong>Methodology & precedent:</strong> Estimates are modeled on two sourced data points: (1) Seychelles Blue Bond (2018) — ~$425K transaction costs on $15M deal (≈2.8%), covered by a Rockefeller Foundation grant (World Bank, 2018); (2) Belize Debt-for-Nature Swap (2021) — ~$85M transaction costs on $364M deal (≈23.4%), reflecting complex multi-party SPV/insurance structure (New America, 2025; TNC Case Study). Cost breakdown allocations are indicative estimates based on typical blended finance deal structuring. The "standardized template" savings estimate of ~50% reflects the hypothesis that standardized term sheets, financial models, and legal templates can significantly reduce legal, advisory, and documentation costs — analogous to the efficiency gains observed when green bond standardization (Green Bond Principles, 2014) reduced issuance costs and scaled the market from $37B to $500B+ annually.
              </p>
            </div>
          </>
        )}

        {/* Precedent Transactions & Sources */}
        {ts.tmpl.precedents && (
          <>
            <div style={sectionHead}>8. Precedent Transactions & Data Sources</div>
            <p style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.slate, marginBottom: 12, lineHeight: 1.6 }}>
              The indicative terms in this term sheet are benchmarked against the following closed transactions and published data:
            </p>
            {ts.tmpl.precedents.map((p, i) => (
              <div key={i} style={{ padding: "10px 14px", background: i % 2 === 0 ? "#f8faf9" : colors.white, borderRadius: 4, marginBottom: 6, border: `1px solid ${colors.divider}` }}>
                <p style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.slate, lineHeight: 1.7, margin: 0 }}>{p}</p>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <span style={{ fontFamily: base.sansFont, fontSize: 11, fontWeight: 600, color: colors.ocean }}>Additional sources informing this term sheet:</span>
              <ul style={{ margin: "6px 0", paddingLeft: 20 }}>
                <li style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, marginBottom: 3 }}>Convergence (2022). "Blended Finance & The Blue Economy." 16 closed SDG 14 transactions, $2.5B total committed financing.</li>
                <li style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, marginBottom: 3 }}>World Bank (2018). "Seychelles Launches World's First Sovereign Blue Bond." Press release & FAQ, October 29, 2018.</li>
                <li style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, marginBottom: 3 }}>TNC / NatureVest (2022). "Belize Debt Conversion for Marine Conservation." Case study.</li>
                <li style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, marginBottom: 3 }}>Mirova (2020). "Sustainable Ocean Fund reaches final close at $132M." Fund overview; FMO Project Detail #53527.</li>
                <li style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, marginBottom: 3 }}>Frontiers in Marine Science (2025). "The Blue Carbon Cost Tool." Avg mangrove VCM price $26.03/tCO₂e (2023), $32/tCO₂e (2024).</li>
                <li style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, marginBottom: 3 }}>Environmental Finance (2024). Voluntary Carbon Market Awards. Blue carbon credits stable at $20–30/tCO₂e.</li>
                <li style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, marginBottom: 3 }}>IFC (2023). Mangrove restoration credits: $15–35/credit with sustainability premium.</li>
                <li style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, marginBottom: 3 }}>Calyx Global / Berkeley Carbon Trading Project (2025). 81 blue carbon projects worldwide; 10 actively issuing credits as of Oct 2025.</li>
                <li style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, marginBottom: 3 }}>Seychelles Blue Bond Structure: GEF $5M concessional (0.25%, 40-yr, 10-yr grace); IBRD $5M guarantee; Rockefeller $425K grant. Effective rate ~2.8%.</li>
                <li style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, marginBottom: 3 }}>Belize Blue Loan Structure: $364M, 19-yr maturity, 10-yr grace, DFC political risk insurance → Aa2 rating, 24-month DSRA, $1.25M/yr conservation milestone escalation.</li>
              </ul>
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div style={{ marginTop: 40, padding: "16px 20px", background: "#f8fafc", borderRadius: 6, border: `1px solid ${colors.divider}` }}>
          <p style={{ fontFamily: base.sansFont, fontSize: 10, color: colors.lightSlate, lineHeight: 1.6, margin: 0 }}>
            <strong>Disclaimer:</strong> This term sheet is for discussion purposes only and does not constitute a binding offer, commitment to lend, or investment recommendation. All terms are indicative and subject to due diligence, credit approval, legal documentation, and definitive agreement execution. Sector benchmarks are derived from the precedent transactions and published data sources cited in Section 7 and may not reflect current market conditions. Note: most blue economy financing to date has occurred through sovereign bonds, debt-for-nature swaps, and fund structures rather than project-level non-recourse debt — project-level benchmarks remain limited. Generated by Swell — blue economy deal infrastructure. A prototype tool developed at Columbia SIPA.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───

export default function BlueDealGenerator() {
  const [step, setStep] = useState(-1); // -1 = landing
  const [data, setData] = useState({
    concessionalPct: "25",
    mezzaninePct: "35",
    risks: {},
    revenueStreams: {},
    impactMetrics: {},
  });
  const [showTermSheet, setShowTermSheet] = useState(false);
  const [hasEstimates, setHasEstimates] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [estimateMeta, setEstimateMeta] = useState(null);
  const [estimateProgress, setEstimateProgress] = useState({
    stage: "idle",
    progress: 0,
    message: "",
    jobId: null,
  });
  const [fieldInsights, setFieldInsights] = useState({});
  const [fieldSuggestions, setFieldSuggestions] = useState({});
  const [activeInsightField, setActiveInsightField] = useState(null);

  const getFieldMeta = (uiKey) => ({
    fieldValue: data?.[uiKey],
    insight: fieldInsights?.[uiKey],
    onOpenInsight: (label) => setActiveInsightField({ key: uiKey, label }),
  });

  const getSuggestionMeta = (uiKey) => ({
    suggestion: fieldSuggestions?.[uiKey],
    onSuggestionChange: (text) =>
      setFieldSuggestions((prev) => ({
        ...prev,
        [uiKey]: { ...(prev[uiKey] || {}), active: true, text },
      })),
    onRemoveSuggestion: () =>
      setFieldSuggestions((prev) => {
        if (!prev[uiKey]) return prev;
        const next = { ...prev };
        delete next[uiKey];
        return next;
      }),
    onOpenInsight: (label) => setActiveInsightField({ key: uiKey, label }),
  });

  const activeInsight = activeInsightField ? fieldInsights?.[activeInsightField.key] : null;
  const effectiveData = applySuggestionOverrides(data, fieldSuggestions);

  const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const pollEstimationJob = async (jobId) => {
    for (;;) {
      await sleep(1000);
      const response = await fetch(`/api/make-estimates/${jobId}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to fetch estimate progress.");
      }
      setEstimateProgress({
        stage: payload.stage || "running",
        progress: Number.isFinite(payload.progress) ? payload.progress : 0,
        message: payload.message || "Working...",
        jobId,
      });
      if (payload.status === "completed") {
        return payload;
      }
      if (payload.status === "failed") {
        throw new Error(payload?.error || payload?.message || "Estimation run failed.");
      }
    }
  };

  const makeEstimates = async () => {
    try {
      setIsEstimating(true);
      setEstimateError("");
      setActiveInsightField(null);
      const questionnaire = buildQuestionnairePayload(effectiveData);
      const response = await fetch("/api/make-estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaire }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to run estimates.");
      }
      const jobId = payload?.jobId;
      if (!jobId) {
        throw new Error("Estimation did not return a job id.");
      }
      setEstimateProgress({
        stage: payload.stage || "queued",
        progress: Number.isFinite(payload.progress) ? payload.progress : 0,
        message: payload.message || "Queued for estimation.",
        jobId,
      });
      const finalPayload = await pollEstimationJob(jobId);
      setData((prev) =>
        applyQuestionnaireValuesToUiData(prev, finalPayload.filledQuestionnaire || {}),
      );
      setFieldInsights(normalizeEstimateInsights(finalPayload?.estimation?.estimates || []));
      setFieldSuggestions(extractChoiceFieldSuggestions(finalPayload?.estimation?.estimates || []));
      setEstimateMeta({
        questionnairePath: finalPayload.questionnairePath,
        filledQuestionnairePath: finalPayload.filledQuestionnairePath,
        runDir: finalPayload.runDir,
        checkpointDir: finalPayload.checkpointDir,
        progressPath: finalPayload.progressPath,
      });
      setHasEstimates(true);
    } catch (error) {
      setEstimateError(error instanceof Error ? error.message : "Failed to run estimates.");
      setFieldInsights({});
      setFieldSuggestions({});
      setHasEstimates(false);
    } finally {
      setIsEstimating(false);
      setEstimateProgress((prev) => ({
        ...prev,
        jobId: null,
      }));
    }
  };

  const stepForms = [
    <StepFundamentals data={data} update={update} getFieldMeta={getFieldMeta} getSuggestionMeta={getSuggestionMeta} />,
    <StepRevenue data={data} update={update} getFieldMeta={getFieldMeta} getSuggestionMeta={getSuggestionMeta} />,
    <StepRisk data={data} update={update} getFieldMeta={getFieldMeta} />,
    <StepCapital data={data} update={update} getFieldMeta={getFieldMeta} getSuggestionMeta={getSuggestionMeta} />,
    <StepImpact data={data} update={update} getFieldMeta={getFieldMeta} getSuggestionMeta={getSuggestionMeta} />,
    <StepGovernance data={data} update={update} getFieldMeta={getFieldMeta} getSuggestionMeta={getSuggestionMeta} />,
  ];

  if (showTermSheet) {
    return (
      <div style={{ minHeight: "100vh", background: colors.sand }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #term-sheet-print, #term-sheet-print * { visibility: visible; }
              #term-sheet-print { position: absolute; left: 0; top: 0; width: 100%; }
              .no-print { display: none !important; }
            }
          `}</style>
          <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button
              onClick={() => setShowTermSheet(false)}
              style={{
                fontFamily: base.sansFont, fontSize: 12, fontWeight: 600, color: colors.teal,
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              ← Back to Swell questionnaire
            </button>
            <button
              onClick={() => window.print()}
              style={{
                fontFamily: base.sansFont, fontSize: 12, fontWeight: 600,
                color: colors.white, background: colors.teal,
                border: "none", borderRadius: 6, padding: "10px 20px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: `0 2px 8px ${colors.teal}44`,
              }}
            >
              <span style={{ fontSize: 15 }}>↓</span> Export as PDF
            </button>
          </div>
          <div id="term-sheet-print" style={{ background: colors.white, borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <TermSheetOutput data={effectiveData} />
          </div>
        </div>
      </div>
    );
  }

  // Landing
  if (step === -1) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${colors.navy} 0%, ${colors.deepBlue} 40%, ${colors.ocean} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 4 }}>
            <SwellLogo size={40} light={true} />
            <h1 style={{ fontFamily: base.fontFamily, fontSize: 42, fontWeight: 700, color: colors.white, margin: 0, lineHeight: 1.1 }}>
              Swell
            </h1>
          </div>
          <div style={{ fontFamily: base.sansFont, fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: colors.seafoam, marginBottom: 20 }}>
            Blue Economy Deal Infrastructure
          </div>
          <h2 style={{ fontFamily: base.fontFamily, fontSize: 22, fontWeight: 400, color: "#c8dce8", margin: "0 0 16px", lineHeight: 1.4 }}>
            From project to term sheet in fifteen minutes
          </h2>
          <p style={{ fontFamily: base.sansFont, fontSize: 15, color: colors.lightSlate, lineHeight: 1.7, margin: "0 0 40px" }}>
            Answer six blocks of guided questions about your blue economy project. We'll generate a structured blended finance term sheet with sector-calibrated tranche architecture, risk allocation, and impact covenants — the document an investor's credit committee needs to see.
          </p>
          <button
            onClick={() => setStep(0)}
            style={{
              fontFamily: base.sansFont, fontSize: 14, fontWeight: 600,
              color: colors.navy, background: colors.seafoam,
              border: "none", borderRadius: 8, padding: "14px 40px",
              cursor: "pointer", letterSpacing: "0.02em",
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: `0 4px 16px ${colors.seafoam}44`,
            }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = `0 6px 24px ${colors.seafoam}66`; }}
            onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 16px ${colors.seafoam}44`; }}
          >
            Start questionnaire →
          </button>
          <p style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate, marginTop: 24, opacity: 0.7 }}>
            Swell · Columbia SIPA · Climate Tech & Regenerative Entrepreneurship
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: colors.sand }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <SwellLogo size={14} />
          <span style={{ fontFamily: base.sansFont, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.teal }}>Swell</span>
        </div>
        <ProgressBar step={step} total={STEPS.length} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
          <div>
            <span style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate }}>Step {step + 1} of {STEPS.length}</span>
            <h2 style={{ fontFamily: base.fontFamily, fontSize: 24, fontWeight: 700, color: colors.navy, margin: "4px 0 0" }}>{STEPS[step]}</h2>
          </div>
        </div>
        <div style={{ background: colors.white, borderRadius: 10, padding: "32px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: `1px solid ${colors.divider}` }}>
          {stepForms[step]}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{
              fontFamily: base.sansFont, fontSize: 13, fontWeight: 600,
              color: step === 0 ? colors.lightSlate : colors.ocean,
              background: "none", border: `1px solid ${step === 0 ? colors.divider : colors.ocean}`,
              borderRadius: 6, padding: "10px 24px", cursor: step === 0 ? "default" : "pointer",
              opacity: step === 0 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              style={{
                fontFamily: base.sansFont, fontSize: 13, fontWeight: 600,
                color: colors.white, background: colors.teal,
                border: "none", borderRadius: 6, padding: "10px 28px", cursor: "pointer",
              }}
            >
              Next →
            </button>
          ) : (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={makeEstimates}
                disabled={isEstimating}
                style={{
                  fontFamily: base.sansFont, fontSize: 13, fontWeight: 700,
                  color: colors.white, background: colors.teal,
                  border: "none", borderRadius: 6, padding: "10px 18px",
                  cursor: isEstimating ? "default" : "pointer",
                  opacity: isEstimating ? 0.7 : 1,
                }}
              >
                {isEstimating ? "Making estimates..." : "Make estimates"}
              </button>
              <button
                onClick={() => setShowTermSheet(true)}
                disabled={!hasEstimates}
                style={{
                  fontFamily: base.sansFont, fontSize: 13, fontWeight: 700,
                  color: hasEstimates ? colors.navy : colors.lightSlate,
                  background: hasEstimates ? colors.seafoam : colors.divider,
                  border: "none", borderRadius: 6, padding: "10px 18px",
                  cursor: hasEstimates ? "pointer" : "default",
                  boxShadow: hasEstimates ? `0 2px 8px ${colors.seafoam}44` : "none",
                }}
              >
                Generate Term Sheet →
              </button>
            </div>
          )}
        </div>
        {step === STEPS.length - 1 && (
          <div style={{ marginTop: 12 }}>
            {estimateMeta?.questionnairePath && (
              <p style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate, margin: "0 0 4px" }}>
                Saved questionnaire: {estimateMeta.questionnairePath}
              </p>
            )}
            {estimateMeta?.filledQuestionnairePath && (
              <p style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate, margin: "0 0 4px" }}>
                Saved filled questionnaire: {estimateMeta.filledQuestionnairePath}
              </p>
            )}
            {estimateMeta?.runDir && (
              <p style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate, margin: "0 0 4px" }}>
                Estimation run logs: {estimateMeta.runDir}
              </p>
            )}
            {estimateMeta?.checkpointDir && (
              <p style={{ fontFamily: base.sansFont, fontSize: 11, color: colors.lightSlate, margin: "0 0 4px" }}>
                Checkpoints: {estimateMeta.checkpointDir}
              </p>
            )}
            {estimateError && (
              <p style={{ fontFamily: base.sansFont, fontSize: 11, color: "#dc2626", margin: 0 }}>
                {estimateError}
              </p>
            )}
          </div>
        )}
      </div>
      {isEstimating && (
        <LoadingOverlay
          progress={estimateProgress.progress}
          stage={estimateProgress.stage}
          message={estimateProgress.message}
        />
      )}
      {activeInsight && (
        <FieldInsightModal
          label={activeInsightField?.label || "Estimated field"}
          insight={activeInsight}
          onClose={() => setActiveInsightField(null)}
        />
      )}
    </div>
  );
}