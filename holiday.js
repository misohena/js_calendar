//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/
//_/ CopyRight(C) K.Tsunoda(AddinBox) 2001 All Rights Reserved.
//_/ ( http://www.h3.dion.ne.jp/~sakatsu/index.htm )
//_/
//_/   ���̏j������R�[�h�́wExcel:kt�֐��A�h�C���x�Ŏg�p���Ă���
//_/   �u�a�`�}�N����[JavaScript]�ɈڐA�������̂ł��B
//_/   ���̊֐��ł́A�Q�O�O�V�N�{�s�̉����j���@(���a�̓�)�܂ł�
//_/ �@�T�|�[�g���Ă��܂�(�X���̍����̋x�����܂�)�B
//_/
//_/ (*1)���̃R�[�h�����p����ɓ������ẮA�K�����̃R�����g��
//_/ �ꏏ�Ɉ��p���鎖�Ƃ��܂��B
//_/ (*2)���T�C�g��Ŗ{�}�N���𒼐ڈ��p���鎖�́A�������肢�܂��B
//_/ �y http://www.h3.dion.ne.jp/~sakatsu/holiday_logic.htm �z
//_/ �ւ̃����N�ɂ��Љ�őΉ����ĉ������B
//_/ (*3)[ktHolidayName]�Ƃ����֐������̂��̂́A�e���̊���
//_/ �����閽���K���ɉ����ĕύX���Ă��\���܂���B
//_/ 
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// 2008/10/29 �ϐ���var�w�肪�����A�L��ϐ������ɂȂ��Ă����̂��C�����܂����B

var MONDAY = 1;
var TUESDAY = 2;
var WEDNESDAY = 3;

// JavaScript�ň�������t��1970/1/1�`�̂�
//var cstImplementTheLawOfHoliday = new Date("1948/7/20");  // �j���@�{�s
//var cstAkihitoKekkon = new Date("1959/4/10");              // ���m�e���̌����̋V
var cstShowaTaiso = new Date("1989/2/24");                // ���a�V�c��r�̗�
var cstNorihitoKekkon = new Date("1993/6/9");            // ���m�e���̌����̋V
var cstSokuireiseiden = new Date("1990/11/12");          // ���ʗ琳�a�̋V
var cstImplementHoliday = new Date("1973/4/12");        // �U�֋x���{�s


// [prmDate]�ɂ� "yyyy/m/d"�`���̓��t�������n��
function ktHolidayName(prmDate)
{
  var MyDate = new Date(prmDate);
  var HolidayName = prvHolidayChk(MyDate);
  var YesterDay;
  var HolidayName_ret;

  if (HolidayName == "") {
      if (MyDate.getDay() == MONDAY) {
          // ���j�ȊO�͐U�֋x������s�v
          // 5/6(��,��)�̔����prvHolidayChk�ŏ�����
          // 5/6(��)�͂����Ŕ��肷��
          if (MyDate.getTime() >= cstImplementHoliday.getTime()) {
              YesterDay = new Date(MyDate.getFullYear(),
                                     MyDate.getMonth(),(MyDate.getDate()-1));
              HolidayName = prvHolidayChk(YesterDay);
              if (HolidayName != "") {
                  HolidayName_ret = "�U�֋x��";
              } else {
                  HolidayName_ret = "";
              }
          } else {
              HolidayName_ret = "";
          }
      } else {
          HolidayName_ret = "";
      }
  } else {
      HolidayName_ret = HolidayName;
  }

  return HolidayName_ret;
}

//===============================================================

function prvHolidayChk(MyDate)
{
  var MyYear = MyDate.getFullYear();
  var MyMonth = MyDate.getMonth() + 1;    // MyMonth:1�`12
  var MyDay = MyDate.getDate();
  var Result = "";
  var NumberOfWeek;
  var MyAutumnEquinox;

// JavaScript�ň�������t��1970/1/1�`�݂̂ŏj���@�{�s��Ȃ̂ŉ��L�͕s�v
// if (MyDate.getTime() < cstImplementTheLawOfHoliday.getTime()) {
// �@�@return ""; // �j���@�{�s(1948/7/20)�ȑO
// } else;

  switch (MyMonth) {
// �P�� //
  case 1:
      if (MyDay == 1) {
          Result = "����";
      } else {
          if (MyYear >= 2000) {
              NumberOfWeek = Math.floor((MyDay - 1) / 7) + 1;
              if ((NumberOfWeek == 2) && (MyDate.getDay() == MONDAY)) {
                  Result = "���l�̓�";
              } else;
          } else {
              if (MyDay == 15) {
                  Result = "���l�̓�";
              } else;
          }
      }
      break;
// �Q�� //
  case 2:
      if (MyDay == 11) {
          if (MyYear >= 1967) {
              Result = "�����L�O�̓�";
          } else;
      } else {
          if (MyDate.getTime() == cstShowaTaiso.getTime()) {
              Result = "���a�V�c�̑�r�̗�";
          } else;
      }
      break;
// �R�� //
  case 3:
      if (MyDay == prvDayOfSpringEquinox(MyYear)) {  // 1948�`2150�ȊO��[99]
          Result = "�t���̓�";                       // ���Ԃ�̂Ť�K�����ɂȂ�
      } else;
      break;
// �S�� //
  case 4:
      if (MyDay == 29) {
          if (MyYear >= 2007) {
              Result = "���a�̓�";
          } else {
              if (MyYear >= 1989) {
                  Result = "�݂ǂ�̓�";
              } else {
                Result = "�V�c�a����";
              }
          }
      } else {
          // JavaScript�ň�������t��1970/1/1�`�݂̂Ȃ̂ŉ��L�͕s�v
          // if (MyDate.getTime() == cstAkihitoKekkon.getTime()) {
          // �@�@Result = "�c���q���m�e���̌����̋V";�@�@// (=1959/4/10)
          // } else;
      }
      break;
// �T�� //
  case 5:
      switch ( MyDay ) {
        case 3:  // �T���R��
          Result = "���@�L�O��";
          break;
        case 4:  // �T���S��
          if (MyYear >= 2007) {
              Result = "�݂ǂ�̓�";
          } else {
              if (MyYear >= 1986) {
                  if (MyDate.getDay() > MONDAY) {
                  // 5/4�����j���́w���̓��j�x����j���́w���@�L�O���̐U�֋x���x(�`2006�N)
                      Result = "�����̋x��";
                  } else;
              } else;
          }
          break;
        case 5:  // �T���T��
          Result = "���ǂ��̓�";
          break;
        case 6:  // �T���U��
          if (MyYear >= 2007) {
              if ((MyDate.getDay() == TUESDAY) || (MyDate.getDay() == WEDNESDAY)) {
                  Result = "�U�֋x��";    // [5/3,5/4�����j]�P�[�X�̂݁A�����Ŕ���
              } else;
          } else;
          break;
      }
      break;
// �U�� //
  case 6:
      if (MyDate.getTime() == cstNorihitoKekkon.getTime()) {
          Result = "�c���q���m�e���̌����̋V";
      } else;
      break;
// �V�� //
  case 7:
      if (MyYear >= 2003) {
          NumberOfWeek = Math.floor((MyDay - 1) / 7) + 1;
          if ((NumberOfWeek == 3) && (MyDate.getDay() == MONDAY)) {
              Result = "�C�̓�";
          } else;
      } else {
          if (MyYear >= 1996) {
              if (MyDay == 20) {
                  Result = "�C�̓�";
              } else;
          } else;
      }
      break;
// �X�� //
  case 9:
      //��R���j��(15�`21)�ƏH����(22�`24)���d�Ȃ鎖�͂Ȃ�
      MyAutumnEquinox = prvDayOfAutumnEquinox(MyYear);
      if (MyDay == MyAutumnEquinox) {    // 1948�`2150�ȊO��[99]
          Result = "�H���̓�";           // ���Ԃ�̂Ť�K�����ɂȂ�
      } else {
          if (MyYear >= 2003) {
              NumberOfWeek = Math.floor((MyDay - 1) / 7) + 1;
              if ((NumberOfWeek == 3) && (MyDate.getDay() == MONDAY)) {
                  Result = "�h�V�̓�";
              } else {
                  if (MyDate.getDay() == TUESDAY) {
                      if (MyDay == (MyAutumnEquinox - 1)) {
                          Result = "�����̋x��";
                      } else;
                  } else;
              }
          } else {
              if (MyYear >= 1966) {
                  if (MyDay == 15) {
                      Result = "�h�V�̓�";
                  } else;
              } else;
          }
      }
      break;
// �P�O�� //
  case 10:
      if (MyYear >= 2000) {
          NumberOfWeek = Math.floor(( MyDay - 1) / 7) + 1;
          if ((NumberOfWeek == 2) && (MyDate.getDay() == MONDAY)) {
              Result = "�̈�̓�";
          } else;
      } else {
          if (MyYear >= 1966) {
              if (MyDay == 10) {
                  Result = "�̈�̓�";
              } else;
          } else;
      }
      break;
// �P�P�� //
  case 11:
      if (MyDay == 3) {
          Result = "�����̓�";
      } else {
          if (MyDay == 23) {
              Result = "�ΘJ���ӂ̓�";
          } else {
              if (MyDate.getTime() == cstSokuireiseiden.getTime()) {
                  Result = "���ʗ琳�a�̋V";
              } else;
          }
      }
      break;
// �P�Q�� //
  case 12:
      if (MyDay == 23) {
          if (MyYear >= 1989) {
              Result = "�V�c�a����";
          } else;
      } else;
      break;
  }

  return Result;
}

//===================================================================
// �t��/�H�����̗��Z����
// �w�C��ۈ������H�� ��v�Z������� �V����ݕ֗����x
// �ŏЉ��Ă��鎮�ł��B
function prvDayOfSpringEquinox(MyYear)
{
  var SpringEquinox_ret;

  if (MyYear <= 1947) {
      SpringEquinox_ret = 99;    //�j���@�{�s�O
  } else {
      if (MyYear <= 1979) {
          // Math.floor �֐���[VBA��Int�֐�]�ɑ���
          SpringEquinox_ret = Math.floor(20.8357 + 
            (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
      } else {
          if (MyYear <= 2099) {
              SpringEquinox_ret = Math.floor(20.8431 + 
                (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
          } else {
              if (MyYear <= 2150) {
                  SpringEquinox_ret = Math.floor(21.851 + 
                    (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
              } else {
                  SpringEquinox_ret = 99;    //2151�N�ȍ~�͗��Z���������̂ŕs��
              }
          }
      }
  }
  return SpringEquinox_ret;
}

//=====================================================================
function prvDayOfAutumnEquinox(MyYear)
{
  var AutumnEquinox_ret;

  if (MyYear <= 1947) {
      AutumnEquinox_ret = 99; //�j���@�{�s�O
  } else {
      if (MyYear <= 1979) {
          // Math.floor �֐���[VBA��Int�֐�]�ɑ���
          AutumnEquinox_ret = Math.floor(23.2588 + 
            (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
      } else {
          if (MyYear <= 2099) {
              AutumnEquinox_ret = Math.floor(23.2488 + 
                (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
          } else {
              if (MyYear <= 2150) {
                  AutumnEquinox_ret = Math.floor(24.2488 + 
                    (0.242194 * (MyYear - 1980)) - Math.floor((MyYear - 1980) / 4));
              } else {
                  AutumnEquinox_ret = 99;    //2151�N�ȍ~�͗��Z���������̂ŕs��
              }
          }
      }
  }
  return AutumnEquinox_ret;
}

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/ CopyRight(C) K.Tsunoda(AddinBox) 2001 All Rights Reserved.
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/


