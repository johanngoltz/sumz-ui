import { Directive, Renderer2, ElementRef, Input, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[toDouble]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToDoubleDirective),
    multi: true
  }]
})
export class ToDoubleDirective implements ControlValueAccessor {
  onChangeCallback = (_: any) => { };
  onTouchedCallback = () => { };

  @HostListener('input', ['$event.target.value']) input(value: any) {
    let caretPosition = this.getCaretPosition(this._elementRef.nativeElement);
    let currentNumChars = this.countNumericChars(value.substr(0, caretPosition));
    let seperatorAtEnd = value.slice(-1) === ',' && caretPosition === value.length-1;
    value = parseFloat(value.replace(/\./g, '').replace(/,/g, '.'));
    this.writeValue(value)
    value = value.toLocaleString('de-de') + (seperatorAtEnd ? ',' : '')
    this.onChangeCallback(value);
    this.setCaretPosition(this._elementRef.nativeElement, this.retrieveNewPosition(value, currentNumChars));
  }

  @HostListener('blur', []) touched() {
    this.onTouchedCallback();
  };

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) { }

  writeValue(value: any): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', value.toLocaleString('de-de'));
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  getCaretPosition(inputField) {
    // Initialize
    var position = 0;
    if (inputField.selectionStart || inputField.selectionStart == 0) {
      position = inputField.selectionStart;
    }
    return position;
  }
  setCaretPosition(inputElement, position: number) {
    if (inputElement.createTextRange) {
      var range = inputElement.createTextRange();
      range.move('character', position);
      range.select();
    } else {
      if (inputElement.selectionStart) {
        inputElement.focus();
        inputElement.setSelectionRange(position, position);
      }
      else {
        inputElement.focus();
      }
    }
  }
  countNumericChars(value: String) {
    return (value.match(/[0-9]/gi) || []).length;
  }

  retrieveNewPosition(value: String, nums: Number) {
    let count = 0;
    for(let i = 0; i < value.length; i++) {
      if(value[i].match(/[0-9]/)) {
        count++;
      }
      if(count >= nums){
        return i+1;
      }
    }
    return value.length;
  }

}
